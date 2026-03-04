import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useCodeStore } from "../store/CodeStore";
import { Code2, Trash2, GitCompare, Loader2 } from "lucide-react";
import { applyDagreLayout } from "../utils/layoutUtils";

function CodeEditor() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    code,
    setPaths,
    setCode,
    setParams,
    setNodes,
    setEdges,
    setCyclomaticComplexity,
    setTriggerAnimation,
    setNodeCount,
    setEdgeCount,
  } = useCodeStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const storedTheme = localStorage.getItem("vite-ui-theme");
    const isDark = storedTheme === "dark";

    const editor = monaco.editor.create(editorRef.current, {
      value:
        code ||
        `def cek_ganjil_genap(n):
  if n % 2 == 0:
    return "Genap"
  else:
    return "Ganjil"`,
      language: "python",
      theme: isDark ? "vs-dark" : "vs-light",
      fontSize: 13,
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      roundedSelection: true,
    });

    monacoEditorRef.current = editor;

    return () => editor.dispose();
  }, []);

  // Fungsi pembantu untuk menambahkan penundaan minimum agar loading terlihat
  const withMinimumDelay = async (promise: any, minimumDelay = 500) => {
    const startTime = Date.now();
    const [result] = await Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, minimumDelay)),
    ]);

    // Tambahkan penundaan jika waktu eksekusi kurang dari minimum delay
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minimumDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumDelay - elapsedTime),
      );
    }

    return result;
  };

  const handleGenerateCFG = async () => {
    const editor = monacoEditorRef.current;
    if (!editor) return;

    const codeInput = editor.getValue();
    if (!codeInput.trim()) {
      return toast({
        title: "Kode Kosong",
        variant: "destructive",
        description: "Mohon masukkan kode Python yang valid untuk dianalisis.",
      });
    }

    setCode(codeInput);
    setIsLoading(true);
    toast({
      title: "Menganalisis Kode",
      description: "Mohon tunggu, sedang membuat CFG...",
    });

    try {
      const response = await withMinimumDelay(
        fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeInput }),
        }),
        1000,
      );

      if (!response.ok) throw new Error("Gagal mengambil data dari server");

      const data = await response.json();

      if (data.execution_paths) {
        const paths = data.execution_paths.map((path: any) => ({
          path,
          passed: false,
          test_case: null,
        }));

        setPaths(paths || []);
      }

      if (data.cyclomatic_complexity) {
        setCyclomaticComplexity(data.cyclomatic_complexity);
      }

      if (data.parameters) {
        setParams(data.parameters[0]?.params || []);
      }

      if (data.nodes && data.edges) {
        // Memetakan nodes dan edges
        const mappedNodes = data.nodes.map((node: any) => ({
          id: node.id,
          type: node.type || "default",
          // Scale positions for neater spacing
          position: {
            x: (node.position?.x || 0) * 1,
            y: (node.position?.y || 0) * 1
          },
          data: {
            label: node.data.label,
            tooltip: node.data.tooltip,
            node_type: node.data.node_type,
          },
        }));

        const mappedEdges = data.edges.map((edge: any) => {
          const isConditionTrue = edge.label === "True";
          const isConditionFalse = edge.label === "False";
          const isLoop = edge.label === "loop back";

          // Emerald for True, Red for False, BLACK for default
          const edgeColor =
            isConditionTrue ? "#10b981" : isConditionFalse ? "#ef4444" : "#1a1a1a";

          return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label || "",
            // smoothstep gives clean rounded right-angle routing like the reference
            type: "smoothstep",
            animated: isLoop,
            // Loop-back: arahkan ke titik kiri node target
            ...(isLoop ? { targetHandle: "left" } : {}),
            style: {
              stroke: edgeColor,
              strokeWidth: isLoop ? 1.5 : 2,
              strokeDasharray: isLoop ? "5 5" : undefined,
            },
            labelStyle: {
              fill: edgeColor,
              fontWeight: 800,
              fontSize: 10,
            },
            labelBgPadding: [6, 3],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: "#fff", fillOpacity: 0.95 },
            markerEnd: {
              type: "arrowclosed",
              color: edgeColor,
            },
          };
        });

        // Apply Dagre auto-layout for clean hierarchical positioning
        const layoutedNodes = applyDagreLayout(mappedNodes as any, mappedEdges as any);

        setNodeCount(data.nodes_count || layoutedNodes.length);
        setEdgeCount(data.edges_count || mappedEdges.length);
        setNodes(layoutedNodes as any);
        setEdges(mappedEdges as any);
        setTriggerAnimation(Date.now());

        toast({
          title: "Analisis Selesai",
          description: `Berhasil memproses CFG`,
          variant: "default",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Terjadi Kesalahan",
        variant: "destructive",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Editor Header */}
      <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Input Kode Utama</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => monacoEditorRef.current?.setValue("")}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 min-h-0 relative">
        <div ref={editorRef} className="absolute inset-0"></div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 mt-auto">
        <Button
          className="w-full h-12 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          onClick={handleGenerateCFG}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <GitCompare className="w-5 h-5" />
              Proses Analisis Kode
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CodeEditor;
