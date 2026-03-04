import { useEffect } from "react";
import { useCodeStore } from "../store/CodeStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3 } from "lucide-react";

const CoveragePath = () => {
  // 1. Ambil paths dan setter setCoverage dari store
  const { paths, setCoverage } = useCodeStore();

  // 2. Hitung logika coverage lokal
  const totalPassed = paths ? paths.filter((item) => item.passed).length : 0;
  const totalPaths = paths ? paths.length : 0;

  // Hindari NaN jika totalPaths 0
  const totalCoverage = totalPaths > 0 ? (totalPassed / totalPaths) * 100 : 0;

  // 3. SINKRONISASI: Simpan hasil hitungan ke Store setiap kali nilai berubah
  useEffect(() => {
    setCoverage(totalCoverage);
  }, [totalCoverage, setCoverage]);

  return (
    <Card className="border-none bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Path Coverage</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 tabular-nums">
            {totalCoverage.toFixed(0)}<span className="text-sm text-gray-300 ml-0.5">%</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="relative h-3 w-full bg-gray-50 rounded-full overflow-hidden mb-2">
          <div
            className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            style={{ width: `${totalCoverage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-gray-300 uppercase">
          <span>Progress Analisis</span>
          <span className={totalCoverage === 100 ? 'text-emerald-500' : ''}>
            {totalPassed}/{totalPaths} JALUR
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoveragePath;