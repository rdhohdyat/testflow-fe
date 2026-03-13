import { useState, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  FileCode,
  Activity,
  GitBranch,
  Terminal,
  Download,
  FileText,
  Clock,
  Share2,
  Copy,
  Check,
  Menu,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../data/node";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "./theme-provider";
import { getComplexityInfo } from "../utils/complexity";

interface SavedAnalysis {
  id: number;
  name: string;
  source_code: string;
  path_list: any;
  cyclomatic_complexity: number;
  coverage_path: number;
  test_cases: any;
  created_at: string;
  nodes_list: any;
  edges_list: any;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectCodes: SavedAnalysis[];
}

export default function ExportDialog({
  open,
  onOpenChange,
  projectName,
  projectCodes: initialCodes,
}: ExportDialogProps) {
  const { theme } = useTheme()

  const [codes, setCodes] = useState<SavedAnalysis[]>(initialCodes);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<number | null>(null);

  const generateFullPDF = () => {
    if (codes.length === 0) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString("id-ID");

    // --- HALAMAN JUDUL ---
    doc.setFontSize(22);
    doc.text("LAPORAN PEMBUATAN TEST CASE KODE", 105, 80, { align: "center" });
    doc.setFontSize(16);
    doc.text(`Project: ${projectName}`, 105, 95, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${timestamp}`, 105, 280, { align: "center" });

    // --- ITERASI SETIAP DATA ANALISIS ---
    codes.forEach((analysis: SavedAnalysis, index: number) => {
      doc.addPage();

      // Header Halaman Analisis
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Analisis #${index + 1}: ${analysis.name || "Tanpa Nama"}`,
        14,
        20,
      );

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `ID: ${analysis.id} | Dibuat: ${new Date(analysis.created_at).toLocaleString("id-ID")}`,
        14,
        27,
      );

      // 1. Tabel Metrik
      autoTable(doc, {
        startY: 32,
        head: [["Parameter", "Hasil Analisis"]],
        body: [
          ["Cyclomatic Complexity (CC)", analysis.cyclomatic_complexity],
          ["Code Coverage", `${analysis.coverage_path?.toFixed(1) || 0}%`],
          ["Total Baris Kode", analysis.source_code.split("\n").length],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      // 2. Tabel Source Code
      doc.setFontSize(11);
      doc.text("Source Code:", 14, (doc as any).lastAutoTable.finalY + 10);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 13,
        body: [[analysis.source_code]],
        styles: { font: "courier", fontSize: 8 },
        theme: "plain",
        // @ts-ignore
        fillColor: [245, 245, 245],
      });

      // 3. Tabel Jalur Independen
      const currentPaths = parseData(analysis.path_list, "path");
      doc.text(
        `Jalur Independen (${currentPaths.length}):`,
        14,
        (doc as any).lastAutoTable.finalY + 10,
      );

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 13,
        head: [["No", "Urutan Jalur (Nodes)"]],
        body: currentPaths.map((p, i) => [i + 1, formatPath(p.path || p)]),
        styles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 10 } },
      });

      // 4. Tabel Hasil Test Case (Jika Ada)
      const testCases = currentPaths.filter((p: any) => p.testCase);
      if (testCases.length > 0) {
        doc.text(
          "Hasil Eksekusi Test Case:",
          14,
          (doc as any).lastAutoTable.finalY + 10,
        );

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 13,
          head: [["No", "Input", "Status"]],
          body: testCases.map((t, i) => [
            i + 1,
            JSON.stringify(t.testCase),
            t.passed ? "PASSED" : "FAILED",
          ]),
          headStyles: { fillColor: [39, 174, 96] },
          styles: { fontSize: 8 },
        });
      }
    });

    // Footer Nomor Halaman
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, 190, 285, { align: "right" });
    }

    doc.save(`Laporan_Project_${projectName.replace(/\s+/g, "_")}.pdf`);
  };

  useEffect(() => {
    if (open && codes.length > 0) {
      setSelectedAnalysisId(codes[codes.length - 1].id);
    }
    // Sync local state ketika prop berubah (misal data baru)
    setCodes(initialCodes);
  }, [open, initialCodes]);

  const currentData = codes.find((c) => c.id === selectedAnalysisId);

  const handleDeleteAnalysisClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // jangan trigger pilih item
    setAnalysisToDelete(id);
  };

  const confirmDeleteAnalysis = async () => {
    if (!analysisToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/codes/${analysisToDelete}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal");
      const remaining = codes.filter((c) => c.id !== analysisToDelete);
      setCodes(remaining);
      // Pilih item lain jika yang dihapus sedang aktif
      if (selectedAnalysisId === analysisToDelete) {
        setSelectedAnalysisId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
      }
    } catch {
      alert("Gagal menghapus analisis.");
    } finally {
      setAnalysisToDelete(null);
    }
  };

  const handleCopyCode = () => {
    if (currentData?.source_code) {
      navigator.clipboard.writeText(currentData.source_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // @ts-ignore
  const parseData = (data: any, type: string) => {
    if (!data) return [];
    let parsed = data;
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch {
        return [];
      }
    }
    return Array.isArray(parsed) ? parsed : [];
  };

  const formatPath = (p: any) => {
    // 1. Jika data adalah Array (misal: [1, 2, 3])
    if (Array.isArray(p)) return p.join(", ");

    // 2. Jika data adalah String (misal: "1 !' 2 !' 3")
    if (typeof p === "string") {
      // Regex ini akan mencari tanda seru (!) dan karakter kutipan (') 
      // lalu menggantinya dengan koma dan spasi yang rapi
      return p.replace(/[!']/g, "").replace(/\s+/g, " ").split(" ").join(", ");
    }

    // 3. Jika data di dalam objek (misal: { path: [1,2,3] })
    if (p && typeof p === 'object' && p.path) {
      return Array.isArray(p.path) ? p.path.join(", ") : String(p.path);
    }

    return "-";
  };

  const paths = currentData ? parseData(currentData.path_list, "path") : [];
  const nodes = currentData ? parseData(currentData.nodes_list, "graph") : [];
  const edges = currentData ? parseData(currentData.edges_list, "graph") : [];
  const executedPaths = paths.filter(
    (item: any) => item.testCase !== undefined && item.testCase !== null,
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full">
      <div className="p-3 border-b bg-neutral-100/50 dark:bg-neutral-900 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3 h-3" /> Pilih Versi
        </h3>
      </div>
      <ScrollArea className="flex-1 dark:bg-neutral-900">
        <div className="flex flex-col p-2 gap-1">
          {codes.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              Belum ada riwayat.
            </div>
          ) : (
            [...codes].reverse().map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group flex items-center gap-1 p-3 rounded-lg text-left transition-all border cursor-pointer",
                  selectedAnalysisId === item.id
                    ? "bg-white border border-neutral-200 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:border-neutral-200"
                    : "border-transparent hover:bg-white hover:border-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-900",
                )}
                onClick={() => {
                  setSelectedAnalysisId(item.id);
                  setShowSidebar(false);
                }}
              >
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "font-semibold text-sm truncate block",
                      selectedAnalysisId === item.id
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-neutral-700 dark:text-neutral-300",
                    )}
                  >
                    {item.name || `Analisis #${item.id}`}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                {/* Tombol hapus — muncul saat hover */}
                <button
                  onClick={(e) => handleDeleteAnalysisClick(item.id, e)}
                  className="transition-opacity p-1 rounded hover:bg-red-50 text-neutral-300 hover:text-red-500 flex-shrink-0"
                  title="Hapus analisis ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-7xl w-[98vw] h-[98vh] sm:h-[90vh] flex flex-col gap-0 p-0 overflow-hidden dark:bg-neutral-900">
        <DialogHeader className="px-4 sm:px-6 py-3 border-b dark:bg-neutral-900 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <DialogTitle className="text-base sm:text-lg">
                Project: {projectName}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden relative">
          {/* SIDEBAR */}
          <div
            className={cn(
              "absolute inset-0 z-50 bg-white dark:bg-neutral-950 sm:relative sm:z-0 sm:flex sm:w-1/5 sm:border-r transition-transform duration-300",
              showSidebar
                ? "translate-x-0"
                : "-translate-x-full sm:translate-x-0",
            )}
          >
            <SidebarContent />
            <Button
              className="absolute bottom-4 right-4 sm:hidden"
              onClick={() => setShowSidebar(false)}
            >
              Tutup
            </Button>
          </div>

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col bg-neutral-50/50 dark:bg-neutral-950 min-w-0">
            {currentData ? (
              <ScrollArea className="h-full">
                {/* --- MOBILE VIEW: PAKAI TABS --- */}
                <div className="sm:hidden p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-4 h-auto p-1">
                      <TabsTrigger value="overview" className="p-2">
                        <Activity className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="graph" className="p-2">
                        <Share2 className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="code" className="p-2">
                        <FileCode className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="paths" className="p-2">
                        <GitBranch className="w-4 h-4" />
                      </TabsTrigger>
                      <TabsTrigger value="tests" className="p-2">
                        <Terminal className="w-4 h-4" />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <MetricCard
                        label="CC"
                        value={currentData.cyclomatic_complexity}
                        sub="Logika"
                        isComplexity
                      />
                      <MetricCard
                        label="Coverage"
                        value={`${currentData.coverage_path || 0}%`}
                        sub="Jalur"
                        isGood
                      />
                    </TabsContent>

                    <TabsContent
                      value="graph"
                      className="h-[400px] border rounded-lg bg-white overflow-hidden"
                    >
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                      >
                        <Background />
                      </ReactFlow>
                    </TabsContent>

                    <TabsContent value="code" className="h-[400px] border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950">
                      <MonacoDisplay
                        code={currentData.source_code}
                        theme={theme || "light"}
                      />
                    </TabsContent>

                    <TabsContent value="paths" className="space-y-2">
                      {paths.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="p-2 border rounded text-[10px] bg-white"
                        >
                          {formatPath(Array.isArray(p) ? p : p.path)}
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="tests" className="space-y-2">
                      {executedPaths.map((p: any, i: number) => (
                        <div
                          key={i}
                          className="p-2 border rounded text-[10px] bg-white flex justify-between"
                        >
                          <span>Case #{i + 1}</span>
                          <Badge variant={p.passed ? "default" : "destructive"}>
                            {p.passed ? "Pass" : "Fail"}
                          </Badge>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* --- DESKTOP VIEW: TANPA TAB (SEMUA TAMPIL) --- */}
                <div className="hidden sm:grid grid-cols-12 gap-6 p-6">
                  {/* Row 1: Metrics & Info */}
                  <div className="col-span-12 grid grid-cols-4 gap-4">
                    <MetricCard
                      label="Complexity"
                      value={currentData.cyclomatic_complexity}
                      sub="Siklomatik"
                      isComplexity
                    />
                    <MetricCard
                      label="Coverage"
                      value={`${currentData.coverage_path || 0}%`}
                      sub="Jalur Uji"
                      color="emerald"
                    />
                    <Card className="col-span-2 rounded-3xl  shadow-sm overflow-hidden bg-white dark:bg-neutral-900">
                      <div className="bg-neutral-50/50 dark:bg-neutral-800/50 px-5 py-3 text-[10px] font-black uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 text-neutral-500">
                        Informasi Analisis
                      </div>
                      <CardContent className="p-2 space-y-1">
                        <StatRow label="Versi Nama" value={currentData.name} />
                        <StatRow
                          label="Disimpan pada"
                          value={new Date(
                            currentData.created_at,
                          ).toLocaleString("id-ID", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 2: Graph & Source Code */}
                  <div className="col-span-8 space-y-4">
                    <Card className="overflow-hidden rounded-2xl">
                      <div className="bg-neutral-100 dark:bg-neutral-900 p-2 text-xs font-semibold border-b flex items-center gap-2">
                        <Share2 className="w-3 h-3" /> Control Flow Graph
                      </div>
                      <div className="h-[450px] bg-white dark:bg-neutral-900">
                        <ReactFlow
                          nodes={nodes}
                          edges={edges}
                          nodeTypes={nodeTypes}
                          fitView
                        >
                          <Background variant={BackgroundVariant.Dots} gap={12} />
                          <Controls />
                          <Controls />
                        </ReactFlow>
                      </div>
                    </Card>
                    <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
                      {/* Header: Lebih clean dengan warna neutral */}
                      <div className="bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between transition-colors">
                        <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                          <FileCode className="w-3.5 h-3.5" />
                          Source Code
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyCode}
                          className="h-7 w-7 p-0 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-all"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>

                      {/* Monaco Editor Display */}
                      <div className="h-[350px] overflow-hidden">
                        <MonacoDisplay
                          code={currentData.source_code}
                          theme={theme || "light"}
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Row 2 Side: Paths & Test Cases */}
                  <div className="col-span-4 space-y-5">
                    <Card className="h-[380px] flex flex-col rounded-3xl shadow-sm overflow-hidden bg-white dark:bg-neutral-900">
                      <div className="bg-neutral-50/50 dark:bg-neutral-800/50 px-5 py-3 text-[10px] font-black uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-neutral-500">
                        <GitBranch className="w-3.5 h-3.5" />
                        Independent Paths ({paths.length})
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                          {paths.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="group flex items-center gap-4 p-3 rounded-2xl bg-neutral-50/30 dark:bg-neutral-800/30 border dark:border-neutral-800 transition-all hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0">
                                #{i + 1}
                              </div>
                              <div className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 font-mono tracking-tighter line-clamp-2">
                                {formatPath(Array.isArray(item) ? item : item.path)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>

                    <Card className="h-[380px] flex flex-col rounded-3xl shadow-sm overflow-hidden bg-white dark:bg-neutral-900">
                      <div className="bg-neutral-50/50 dark:bg-neutral-800/50 px-5 py-3 text-[10px] font-black uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-neutral-500">
                        <Terminal className="w-3.5 h-3.5" />
                        Test Execution ({executedPaths.length})
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="h-full">
                          {executedPaths.length > 0 ? (
                            <div className="space-y-3">
                              {executedPaths.map((item: any, i: number) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "p-4 rounded-2xl border transition-all",
                                    item.passed
                                      ? "bg-emerald-50/20 border-emerald-100/50 dark:bg-emerald-500/5 dark:border-emerald-500/20"
                                      : "bg-rose-50/20 border-rose-100/50 dark:bg-rose-500/5 dark:border-rose-500/20",
                                  )}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Kasus #{i + 1}</span>
                                    <Badge
                                      className={cn(
                                        "border-none px-2 py-0 h-5 text-[8px] font-black uppercase tracking-wider",
                                        item.passed
                                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                          : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                                      )}
                                    >
                                      {item.passed ? "LOLOS" : "GAGAL"}
                                    </Badge>
                                  </div>
                                  <div className="p-2 rounded-lg bg-white/50 dark:bg-neutral-950/50 border border-neutral-100/50 dark:border-neutral-800">
                                    <code className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 break-all leading-tight block">
                                      In: {JSON.stringify(item.testCase)}
                                    </code>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-60">
                              <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-3">
                                <Terminal className="w-6 h-6 text-neutral-300" />
                              </div>
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Belum Ada Tes</h4>
                              <p className="text-[10px] font-bold text-neutral-300 mt-2 max-w-[150px] leading-relaxed">
                                Jalur ini belum diuji atau tidak ada kasus uji yang tersimpan.
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <Activity className="w-16 h-16 mb-4" />
                <p>Pilih riwayat analisis untuk melihat detail laporan</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800">
          <Button className="mt-2 sm:mt-0" variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={generateFullPDF}>
            <Download className="w-4 h-4 mr-2" /> Download Laporan (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog open={!!analysisToDelete} onOpenChange={(open) => !open && setAnalysisToDelete(null)}>
        <AlertDialogContent className="z-[100] rounded-3xl border-none dark:bg-neutral-900 shadow-2xl p-8 max-w-[400px]">
          <AlertDialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <AlertDialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">Hapus Analisis?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-neutral-500 leading-relaxed">
                  Hasil analisis ini akan dihapus permanen dari riwayat proyek.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-3 mt-8 sm:justify-center">
            <AlertDialogCancel className="h-12 rounded-xl font-bold border-neutral-200 text-neutral-600 hover:bg-neutral-50 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAnalysis}
              className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

// Monaco Display Component (Internal Only)
function MonacoDisplay({ code, theme }: { code: string; theme: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: "python",
        theme: theme === "dark" ? "vs-dark" : "vs-light",
        readOnly: true,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 12,
        lineNumbers: "on",
        renderLineHighlight: "none",
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
        },
        padding: { top: 10, bottom: 10 },
      });
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.getValue() !== code) {
        editorRef.current.setValue(code);
      }
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs-light");
    }
  }, [code, theme]);

  return <div ref={containerRef} className="h-full w-full" />;
}

// Helpers
const MetricCard = ({ label, value, sub, isComplexity }: any) => {
  const info = isComplexity ? getComplexityInfo(Number(value)) : null;

  return (
    <Card className="border shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{label}</span>
            {info && (
              <Badge className={cn("border-none px-2 py-0 h-5 text-[8px] font-black uppercase tracking-wider", info.bgColor, info.color)}>
                {info.label}
              </Badge>
            )}
          </div>
          <span className={cn(
            "text-4xl font-black tracking-tighter tabular-nums",
            info ? info.color : "text-emerald-500"
          )}>
            {value}
          </span>
          <span className="text-[10px] font-bold text-neutral-400/60 mt-1">{sub}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center p-3 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">{label}</span>
    <span className="text-[12px] font-black text-neutral-700 dark:text-neutral-200 tracking-tight">{value}</span>
  </div>
);
