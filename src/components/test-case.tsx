import { useState, useEffect, useRef } from "react";
import { useCodeStore } from "../store/CodeStore";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
  // Gunakan HTMLDivElement karena Card biasanya merender tag <div>
  const resultRef = useRef<HTMLDivElement | null>(null);

  const {
    params,
    code,
    paths,
    setPaths,
    setParams,
    testCaseInputs,
    setTestCaseInputs,
    testCaseResult,
    setTestCaseResult,
    lastTestParams,
    setLastTestParams
  } = useCodeStore();

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
    setTestCaseInputs({
      ...testCaseInputs,
      [paramName]: value,
    });
  };

  const handleClear = () => {
    setTestCaseInputs({});
    setTestCaseResult([]);
    setIsSaved(false);
  };

  // Detect if a string value looks like JSON object or array
  const isJsonValue = (value: string): boolean => {
    if (typeof value !== "string") return false;
    const s = value.trim();
    return (s.startsWith("[") && s.endsWith("]")) ||
      (s.startsWith("{") && s.endsWith("}"));
  };

  const prepareParamsForExecution = () => {
    const testParams: Record<string, unknown> = {};
    params.forEach((param) => {
      // @ts-ignore
      let value: unknown = testCaseInputs[param.name];
      const strVal = String(value ?? "");

      // JSON object or array — let backend parse it
      if (isJsonValue(strVal)) {
        try { value = JSON.parse(strVal); } catch { /* send as-is string */ }
      } else if (!isNaN(Number(strVal)) && strVal !== "") {
        value = Number(strVal);
      } else if (strVal === "true") {
        value = true;
      } else if (strVal === "false") {
        value = false;
      }
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

      // Short delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/test_execution/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          parameters: testParams,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      setTestCaseResult(result.actual_execution_path?.line_numbers || []);
      setLastTestParams(testParams);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth", // Gerakan halus
          block: "start"      // Berhenti di bagian atas card
        });
      }, 100);

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
      const isCovered = isSubsequence(pathData, testCaseResult);

      if (isCovered) {
        return {
          ...item,
          passed: true,
          testCase: lastTestParams,
        };
      }

      return item;
    });

    // Short delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update state paths (to show checkmarks in the current list)
    setPaths(updatedPaths);

    // TAMBAHKAN KE RIWAYAT EKSEKUSI (Agar tidak me-replace yang sebelumnya)
    const { addExecutedTestCase } = useCodeStore.getState();
    addExecutedTestCase({
      params: lastTestParams,
      result: testCaseResult,
      passed: true,
      path: testCaseResult
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
    params.every(p => testCaseInputs[p.name] !== undefined && testCaseInputs[p.name] !== "");

  // --- Render ---

  return (
    <div className="space-y-4 pb-2">
      <Card className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-neutral-100/50 dark:shadow-none overflow-hidden">
        <CardHeader className="border-b border-neutral-50 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">
                  Parameter Test Case
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="px-3 h-8 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer text-[10px] font-bold uppercase tracking-wider">
                      Contoh
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md ring-0">
                    <DialogHeader>
                      <DialogTitle className="text-lg">Format Input Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Tipe Data Dasar</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">String</p>
                            <code className="text-xs font-mono font-bold text-emerald-600">hello</code>
                          </div>
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Character</p>
                            <code className="text-xs font-mono font-bold text-emerald-600">a</code>
                          </div>
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Angka</p>
                            <code className="text-xs font-mono font-bold text-emerald-600">10</code>
                          </div>
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Boolean</p>
                            <code className="text-xs font-mono font-bold text-emerald-600">true / false</code>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Tipe Data JSON</h4>
                        <div className="space-y-2">
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Array</p>
                            <pre className="mt-1 text-xs font-mono font-bold text-blue-600">[1, 2, 3, 4]</pre>
                          </div>
                          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Object</p>
                            <pre className="mt-1 text-xs font-mono font-bold text-blue-600">{`{ "id": 1, "name": "Joe" }`}</pre>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                          Gunakan format di atas sesuai dengan tipe data parameter yang dibutuhkan oleh fungsi Anda.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {params?.length > 0 ? (
                  params.map((p) => (
                    // @ts-ignore
                    <Badge key={p.name} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400  font-bold text-[9px] px-2 py-0.5">
                      {
                        // @ts-ignore
                        p.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">Tidak terdeteksi</span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 space-y-4">
          <AnimatePresence>
            {params.map((param, index) => {
              // @ts-ignore
              const currentVal: string = testCaseInputs[param.name] || "";
              const isJson = isJsonValue(currentVal);
              return (
                <motion.div
                  // @ts-ignore
                  key={param.name || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-1.5"
                >
                  <label
                    className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"
                    htmlFor={`param-${index}`}
                  >
                    {/* @ts-ignore */}
                    {param.name}
                    {!currentVal && <span className="text-red-500">*</span>}
                  </label>
                  <Textarea
                    id={`param-${index}`}
                    rows={isJson ? 4 : 1}
                    className={`rounded-xl dark:bg-neutral-800 resize-none text-xs font-bold px-4 py-2 focus-visible:ring-emerald-500 dark:text-white dark:placeholder:text-neutral-500 shadow-sm dark:shadow-none transition-all min-h-0 ${
                      isJson ? "font-mono h-24" : "h-10"
                    }`}
                    placeholder={`Nilai untuk ${param.name}`}
                    value={currentVal}
                    // @ts-ignore
                    onChange={(e) => handleInputChange(param.name, e.target.value)}
                  />
                  {isJson && (
                    <p className="text-[9px] text-blue-500 dark:text-blue-400 font-bold pl-1 animate-in fade-in slide-in-from-top-1 duration-300">
                      Terdeteksi sebagai format Array / Object
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            className="flex-1 h-11 rounded-xl bg-neutral-900 dark:bg-emerald-600 text-white dark:text-white hover:bg-neutral-800 dark:hover:bg-emerald-700 text-[10px] font-black tracking-widest shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95"
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
            className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/50 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95 border-none dark:shadow-none"
            disabled={!params?.length || executing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* CARD 2: Execution Result */}
      <Card ref={resultRef} className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-xl shadow-neutral-100/50 dark:shadow-none overflow-hidden">
        <CardHeader className="p-6 pb-4 bg-white/50 dark:bg-neutral-900/50 border-b border-neutral-50 dark:border-neutral-800">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">Jalur Hasil Eksekusi</CardTitle>
            <div className="w-5 h-5 rounded-full bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-300 font-bold border border-neutral-100 italic">?</div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {testCaseResult.length > 0 ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-white border-none"
              >
                <div className="font-mono text-[12px] font-black text-emerald-700 dark:text-black break-all leading-relaxed">
                  {testCaseResult.join(" → ")}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/50 border border-dashed border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-center gap-2"
              >
                <Info className="w-5 h-5 text-neutral-300" />
                <p className="text-neutral-400 text-[9px] font-black uppercase tracking-widest leading-normal">
                  Masukkan parameter<br />dan jalankan tes
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          {testCaseResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button
                variant={isSaved ? "outline" : "default"}
                onClick={handleSaveResult}
                disabled={isSaved || isSaving}
                className={`w-full h-11 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 ${isSaved ? "bg-neutral-50 dark:bg-neutral-800 text-neutral-400 border-none" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100 dark:shadow-none"
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