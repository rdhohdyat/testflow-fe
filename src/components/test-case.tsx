import { useState, useEffect } from "react";
import { useCodeStore } from "../store/CodeStore";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "./ui/card";

// Icons
import {
  Loader2,
  CheckCircle,
  Play,
  Trash2,
  Save,
  Info,
} from "lucide-react";

// --- Utility Functions (Outside Component) ---

// Algoritma untuk membandingkan kemiripan path
// @ts-ignore
const calculateLCS = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
};

// Helper untuk parsing parameter dari LocalStorage
// @ts-ignore
const parseStoredParams = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    // Case 1: Array of strings ["a", "b"]
    if (typeof parsed[0] === "string") {
      return parsed.map((name) => ({ name, value: undefined }));
    }

    // Case 2: Array of objects [{name: "a", value: 1}]
    if (typeof parsed[0] === "object") {
      return parsed.map((param) => {
        if (param.name) return param;
        // Fallback untuk struktur aneh
        const nameKey = Object.keys(param).find((k) => k !== "value");
        return {
          name: nameKey ? param[nameKey] : "unknown",
          value: param.value,
        };
      });
    }
    return [];
  } catch (e) {
    console.error("Error parsing stored params:", e);
    return [];
  }
};

// --- Main Component ---

function TestCase() {
  // Store
  const { params, code, paths, setPaths, setParams } = useCodeStore();

  // Local State
  const [inputValues, setInputValues] = useState({});
  const [resultText, setResultText] = useState([]);
  const [lastTestParams, setLastTestParams] = useState({});

  // UI State
  const [executing, setExecuting] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Refactored from isTestCaseSave
  const [isSaving, setIsSaving] = useState(false); // Refactored from isSavingTestCase
  const [setShowSuccessAnim] = useState(false);

  // --- Effects ---

  // Load params from localStorage on mount
  useEffect(() => {
    const storedParams = localStorage.getItem("params");
    if (storedParams) {
      const formattedParams = parseStoredParams(storedParams);
      if (formattedParams.length > 0) {
        setParams(formattedParams);
      }
    }
  }, [setParams]);

  // --- Handlers ---
  // @ts-ignore
  const handleInputChange = (paramName, value) => {
    setInputValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const handleClear = () => {
    setInputValues({});
    setResultText([]);
    setIsSaved(false);
  };

  const prepareParamsForExecution = () => {
    const testParams = {};
    params.forEach((param) => {
      // @ts-ignore
      let value = inputValues[param.name];
      // Auto-convert types
      if (!isNaN(Number(value)) && value !== "") value = Number(value);
      else if (value === "true") value = true;
      else if (value === "false") value = false;
      // @ts-ignore
      testParams[param.name] = value;
    });
    return testParams;
  };

  const executeTestCase = async () => {
    try {
      setExecuting(true);
      setIsSaved(false);

      const testParams = prepareParamsForExecution();

      // UI Delay Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("http://localhost:8000/test_execution/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          parameters: testParams,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      setResultText(result.actual_execution_path?.line_numbers || []);
      setLastTestParams(testParams);
    } catch (error) {
      console.error("Gagal menjalankan test case:", error);
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveResult = async () => {
    setIsSaving(true);

    // ===== PERBAIKAN FINAL: Containment check + jangan timpa yang sudah ada =====
    // Execution trace bisa berupa gabungan banyak jalur (terutama saat ada loop).
    // Sebuah path dianggap "covered" jika semua node-nya muncul secara berurutan dalam trace.
    const isSubsequence = (sub: string[], trace: string[]): boolean => {
      let subIdx = 0;
      for (let i = 0; i < trace.length && subIdx < sub.length; i++) {
        if (trace[i] === sub[subIdx]) subIdx++;
      }
      return subIdx === sub.length;
    };

    const updatedPaths = paths.map((item: any) => {
      const pathData: string[] = item.path || item;

      // Jangan timpa jika jalur ini sudah memiliki test case yang tersimpan
      if (item.testCase !== null && item.testCase !== undefined) {
        return item;
      }

      // Cek apakah jalur ini ter-cover oleh hasil eksekusi saat ini
      const isCovered = isSubsequence(pathData, resultText);

      if (isCovered) {
        return {
          ...item,
          passed: true,
          testCase: lastTestParams,
        };
      }

      return item;
    });

    // Simulasi Save Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update state paths (to show checkmarks in the current list)
    setPaths(updatedPaths);

    // TAMBAHKAN KE RIWAYAT EKSEKUSI (Agar tidak me-replace yang sebelumnya)
    const { addExecutedTestCase } = useCodeStore.getState();
    addExecutedTestCase({
      params: lastTestParams,
      result: resultText,
      passed: true,
      path: resultText
    });

    setIsSaved(true);
    setIsSaving(false);

    // Trigger Animation
    // @ts-ignore
    setShowSuccessAnim(true);
    // @ts-ignore
    setTimeout(() => setShowSuccessAnim(false), 2000);
  };

  // Validation
  const hasRequiredParams = params.length > 0 &&
    // @ts-ignore
    params.every(p => inputValues[p.name] !== undefined && inputValues[p.name] !== "");

  // --- Render ---

  return (
    <div className="space-y-4 pb-2">
      {/* CARD 1: Input Parameters */}
      <Card className="border-none bg-white rounded-[2rem] shadow-xl shadow-zinc-100/50 overflow-hidden">
        <CardHeader className=" border-b border-zinc-50 bg-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Parameter Test Case</CardTitle>
              <div className="mt-2 flex flex-wrap gap-1">
                {params?.length > 0 ? (
                  params.map((p) => (
                    // @ts-ignore
                    <Badge key={p.name} className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] px-2 py-0.5">
                      {
                        // @ts-ignore
                        p.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Tidak terdeteksi</span>
                )}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
              <Info className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <AnimatePresence>
            {params.map((param, index) => (
              <motion.div
                // @ts-ignore
                key={param.name || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <label
                  className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1"
                  htmlFor={`param-${index}`}
                >
                  {
                    // @ts-ignore
                    param.name}
                  {
                    // @ts-ignore
                    !inputValues[param.name] && (
                      <span className="text-red-500">*</span>
                    )}
                </label>
                <Input
                  id={`param-${index}`}
                  className="h-10 rounded-xl bg-zinc-50 border-none text-xs font-bold px-4 focus-visible:ring-emerald-500/20"
                  // @ts-ignore
                  placeholder={`Nilai untuk ${param.name}`}
                  // @ts-ignore
                  value={inputValues[param.name] || ""}
                  // @ts-ignore
                  onChange={(e) => handleInputChange(param.name, e.target.value)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            className="flex-1 h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black tracking-widest shadow-lg shadow-zinc-200 transition-all active:scale-95"
            disabled={!params?.length || executing || !hasRequiredParams}
            onClick={executeTestCase}
          >
            {executing ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <>
                <Play className="h-3 w-3 mr-2" />
                JALANKAN TES
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="w-11 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all active:scale-95"
            disabled={!params?.length || executing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* CARD 2: Execution Result */}
      <Card className="border-none bg-white rounded-[2rem] shadow-xl shadow-zinc-100/50 overflow-hidden">
        <CardHeader className="p-6 pb-4 bg-white/50 border-b border-zinc-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Jalur Hasil Eksekusi</CardTitle>
            <div className="w-5 h-5 rounded-full bg-zinc-50 flex items-center justify-center text-[10px] text-zinc-300 font-bold border border-zinc-100 italic">?</div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {resultText.length > 0 ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-emerald-50/50 border-none"
              >
                <div className="font-mono text-[10px] font-black text-emerald-700 break-all leading-relaxed">
                  {resultText.join(" → ")}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-zinc-50/50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center gap-2"
              >
                <Info className="w-5 h-5 text-zinc-300" />
                <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest leading-normal">
                  Masukkan parameter<br />dan jalankan tes
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          {resultText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button
                variant={isSaved ? "outline" : "default"}
                onClick={handleSaveResult}
                disabled={isSaved || isSaving}
                className={`w-full h-11 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 ${isSaved ? "bg-zinc-50 text-zinc-400 border-none" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100"
                  }`}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : isSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    DATA TERSIMPAN
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    SIMPAN HASIL KE METRIK
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TestCase;