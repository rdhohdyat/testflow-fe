import { Moon, Sun } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { cn } from "../lib/utils"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [isRotating, setIsRotating] = useState(false)

  const handleToggle = () => {
    setIsRotating(true)
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    
    setTimeout(() => {
      setIsRotating(false)
    }, 500)
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
    </div>
  )
}