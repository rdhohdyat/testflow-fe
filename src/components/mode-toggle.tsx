import { Moon, Sun, RefreshCw } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { cn } from "../lib/utils"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [isRotating, setIsRotating] = useState(false)
  const [showRefreshPopup, setShowRefreshPopup] = useState(false)

  const handleToggle = () => {
    setIsRotating(true)
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    
    // Munculkan popup setelah delay animasi rotasi selesai
    setTimeout(() => {
      setIsRotating(false)
      setShowRefreshPopup(true)
    }, 500)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative h-10 w-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors overflow-hidden flex items-center justify-center"
      >
        <div className={cn(
          "relative h-[1.2rem] w-[1.2rem] transition-transform duration-500",
          isRotating && "rotate-[360deg]"
        )}>
          <Sun className="h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Pop-up Refresh Halaman */}
      {showRefreshPopup && (
        <div className="absolute top-12 right-0 z-[100] w-64 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tema Berhasil Diubah!</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Muat ulang halaman agar Editor dan Grafik menyesuaikan tema baru secara sempurna.</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleRefresh}
                className="flex-1 h-8 text-[10px] font-black uppercase tracking-tighter bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg"
              >
                Refresh Sekarang
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowRefreshPopup(false)}
                className="h-8 text-[10px] font-bold text-zinc-400 rounded-lg"
              >
                Nanti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}