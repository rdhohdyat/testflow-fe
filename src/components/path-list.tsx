import { useState, useEffect, useCallback } from "react";
import { CircleCheck, CircleX, Terminal } from "lucide-react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";

// Helper aman untuk format path
const formatPath = (p: any) => {
  if (Array.isArray(p)) return p.join(" → ");
  if (typeof p === "string") return p;
  return "-";
};

function PathList() {
  const paths = useCodeStore((state) => state.paths);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [initialRender, setInitialRender] = useState(true);

  const { triggerAnimation } = useCodeStore();

  const animatePaths = useCallback(() => {
    setVisibleItems([]);
    if (paths && paths.length > 0) {
      paths.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prevItems) => [...prevItems, index]);
        }, index * 100);
      });
    }
  }, [paths]);

  useEffect(() => {
    if (triggerAnimation) {
      animatePaths();
      setInitialRender(false);
    }
  }, [triggerAnimation, animatePaths]);

  useEffect(() => {
    if (initialRender && paths.length > 0) {
      setVisibleItems(paths.map((_, index) => index));
      setInitialRender(false);
    }
  }, [initialRender, paths]);

  // Statistik
  const totalPaths = paths ? paths.length : 0;
  const passedPaths = paths ? paths.filter((item: any) => item.passed).length : 0;
  const failedPaths = paths ? paths.filter((item: any) => item.passed === false && item.testCase).length : 0;

  return (
    <Card className="h-full flex flex-col border-none bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Jalur Eksekusi</span>
          </div>
          <Badge className="bg-gray-50 text-gray-500 border-none font-bold text-sm px-2.5 py-1">
            {totalPaths}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col pt-4">
        {/* List Jalur (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {paths && paths.length > 0 ? (
            paths.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-4 p-4 rounded-2xl border-none transition-all duration-500 ${visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  } ${item.passed ? "bg-emerald-50/50" : "bg-gray-50 shadow border border-gray-100"}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${item.passed ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}>
                    {index + 1}
                  </div>
                  <div className="font-mono text-[11px] font-bold text-gray-600 truncate">
                    {formatPath(item.path || item)}
                  </div>
                </div>
                {item.passed ? (
                  <CircleCheck className="flex-shrink-0 w-5 h-5 text-emerald-500" />
                ) : (
                  <CircleX className="flex-shrink-0 w-5 h-5 text-gray-300" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 opacity-50">
              <Terminal className="w-8 h-8" />
              <span className="text-[10px] font-black uppercase tracking-widest">Belum Ada Data</span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-gray-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-xs font-black tracking-widest shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4" />
                ANALISIS TEST CASE
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full md:w-[500px] flex flex-col border-none bg-white p-0 shadow-3xl" side="right">
              <SheetHeader className="p-8 border-b border-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <SheetTitle className="text-2xl font-black tracking-tighter text-gray-900">Detail Analisis</SheetTitle>
                </div>
                <SheetDescription className="flex gap-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-3 py-1">
                    {passedPaths} LOLOS
                  </Badge>
                  <Badge className="bg-red-50 text-red-600 border-none font-bold text-[10px] px-3 py-1">
                    {failedPaths} GAGAL
                  </Badge>
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
                {paths && paths.length > 0 ? (
                  paths.map((item: any, index: number) => {
                    const isTested = item.testCase !== undefined && item.testCase !== null;
                    if (!isTested) return null;

                    return (
                      <Card key={index} className={`border-none rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden ${item.passed ? "bg-emerald-50/20" : "bg-red-50/20"}`}>
                        <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/40">
                          <span className="font-black text-[10px] tracking-widest text-gray-400 uppercase">Kasus Uji #{index + 1}</span>
                          {item.passed ?
                            <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] px-2 py-0.5">PASSED</Badge> :
                            <Badge className="bg-red-500 text-white border-none font-black text-[9px] px-2 py-0.5">FAILED</Badge>
                          }
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Input Parameter</span>
                            <pre className="p-4 bg-white/60 rounded-xl border border-white/50 text-[11px] font-bold text-gray-600 overflow-x-auto">
                              {JSON.stringify(item.testCase, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Jalur Eksekusi</span>
                            <div className="font-mono text-[10px] font-bold text-gray-500 bg-white/60 px-4 py-2 rounded-xl border border-white/50 leading-relaxed">
                              {formatPath(item.path)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-gray-300">
                    <Terminal className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black tracking-widest uppercase">Data Masih Kosong</p>
                  </div>
                )}
              </div>

              <SheetFooter className="p-8 border-t border-gray-50 bg-gray-50/30">
                <SheetClose asChild>
                  <Button className="w-full h-14 rounded-2xl bg-gray-900 font-black tracking-widest text-white shadow-xl">TUTUP ANALISIS</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
}

export default PathList;