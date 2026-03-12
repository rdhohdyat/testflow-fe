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

  const totalPaths = paths ? paths.length : 0;
  const passedPaths = paths ? paths.filter((item: any) => item.passed).length : 0;
  const failedPaths = paths ? paths.filter((item: any) => item.passed === false && item.testCase).length : 0;
  const testedPaths = paths ? paths.filter((item: any) => item.testCase !== undefined && item.testCase !== null) : [];

  return (
    <Card className="h-full flex flex-col  bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-neutral-100/50 dark:shadow-none overflow-hidden transition-colors duration-300">
      <CardHeader className="p-6 pb-4 border-b border-neutral-50 rounded-t-3xl dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-neutral-500 dark:text-white uppercase">Jalur Eksekusi</span>
          </div>
          <Badge className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 border-none font-bold text-sm px-2.5 py-1">
            {totalPaths}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col pt-4">
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {paths && paths.length > 0 ? (
            paths.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-4 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm dark:shadow-none transition-all duration-500 ${visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Angka Indeks membawa warna status, diberi border tipis agar lebih rapi */}
                  <div
                    className={`w-7 h-7 rounded-lg flex shrink-0 items-center justify-center text-[10px] font-black border ${item.passed
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50"
                      : "bg-neutral-50 dark:bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800/50"
                      }`}
                  >
                    {index + 1}
                  </div>

                  <div className="font-mono text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {formatPath(item.path || item)}
                  </div>
                </div>

                {/* Ikon Status dipertegas */}
                {item.passed ? (
                  <CircleCheck className="flex-shrink-0 w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <CircleX className="flex-shrink-0 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-500 gap-3 py-10">
              <Terminal className="w-8 h-8 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Belum Ada Data</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full h-12 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-white text-xs font-black tracking-widest shadow-lg shadow-neutral-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4" />
                LIHAT TEST CASE
              </Button>
            </SheetTrigger>

            {/* Gunakan neutral-950 untuk base background dark mode agar lebih pekat dan clean */}
            <SheetContent className="w-full md:w-[500px] flex flex-col border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-0 shadow-2xl" side="right">

              <SheetHeader className="p-8 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <SheetTitle className="text-xl uppercase font-black tracking-tighter text-neutral-900 dark:text-white">
                    Detail Test Case
                  </SheetTitle>
                </div>
                <SheetDescription className="flex gap-2">
                  <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px] px-3 py-1">
                    {passedPaths} LOLOS
                  </Badge>
                  <Badge className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-none font-bold text-[10px] px-3 py-1">
                    {failedPaths} GAGAL
                  </Badge>
                </SheetDescription>
              </SheetHeader>

              {/* Area Scroll */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 custom-scrollbar bg-neutral-50/50 dark:bg-neutral-950">
                {testedPaths.length > 0 ? (
                  testedPaths.map((item: any, index: number) => {
                    return (
                      <Card key={index} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm dark:shadow-none overflow-hidden bg-white dark:bg-neutral-900">
                        {/* Header Card */}
                        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
                          <span className="font-bold text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
                            Kasus Uji #{index + 1}
                          </span>
                          {item.passed ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-black text-[9px] px-2 py-0.5">LOLOS</Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 font-black text-[9px] px-2 py-0.5">GAGAL</Badge>
                          )}
                        </div>

                        {/* Content Card */}
                        <CardContent className="p-5 space-y-5">
                          <div>
                            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                              Input Parameter
                            </span>
                            {/* Gunakan neutral-950 untuk area kode agar terlihat "masuk" ke dalam (inset) di atas neutral-900 */}
                            <pre className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 overflow-x-auto">
                              {JSON.stringify(item.testCase, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                              Jalur Eksekusi
                            </span>
                            <div className="font-mono text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800 leading-relaxed">
                              {formatPath(item.path)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-600 py-20">
                    <Terminal className="w-10 h-10 mb-4 opacity-50 text-neutral-300 dark:text-neutral-700" />
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-600">Belum Ada Kasus Uji</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">Silahkan jalankan pengetesan terlebih dahulu</p>
                  </div>
                )}
              </div>

              <SheetFooter className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white font-bold tracking-widest">
                    TUTUP ANALISIS
                  </Button>
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