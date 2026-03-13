import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { GitCompare, Info, Loader2, Sparkles } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/work");
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="container flex flex-col items-center justify-center px-8 mt-32 mb-20 overflow-hidden">
      <motion.div
        className="flex flex-col w-full max-w-5xl gap-10 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 text-[6px] sm:text-[10px] font-black tracking-[0.3em] uppercase rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 shadow-sm dark:shadow-none">
            <Sparkles className="w-3 h-3" />
            Generator Control Flow Graph Otomatis
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-4xl md:text-[5rem] font-black leading-[0.85] tracking-tighter text-neutral-900 dark:text-white">
            Petakan <span className="italic text-emerald-500">Logika</span> <br />
            Kode Anda
          </h1>
          <p className="text-xl md:text-3xl font-black tracking-tight text-emerald-500/90 leading-tight">
            Menjadi Control Flow Graph
          </p>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-sm md:text-lg text-neutral-400 dark:text-neutral-500 max-w-xl mx-auto leading-relaxed font-medium"
        >
          Konversi <span className="text-neutral-900 dark:text-white font-bold">Source Code</span> Python Anda menjadi CFG interaktif. Hitung <span className="text-neutral-900 dark:text-white font-bold">Cyclomatic Complexity</span> dan temukan jalur independen secara instan.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-2  sm:mt-4"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLaunch}
                  size="lg"
                  className="rounded-[1.5rem] h-12 sm:h-16 px-10 text-sm sm:text-base font-black tracking-tight bg-neutral-900 text-white hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-neutral-300/50 dark:shadow-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  ) : (
                    <GitCompare className="w-5 h-5 mr-3" />
                  )}
                  {isLoading ? "MENYIAPKAN..." : "MULAI ANALISIS"}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl font-bold bg-neutral-900 text-white">
                <p>Buka dashboard workspace</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <a href="#docs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="rounded-[1.5rem] h-12 sm:h-16 px-10 text-sm sm:text-base font-black tracking-tight border-2 border-neutral-100 bg-white text-neutral-900 hover:bg-neutral-50 transition-all hover:scale-105"
            >
              <Info className="w-5 h-5 mr-3 text-neutral-400" />
              PELAJARI FITUR
            </Button>
          </a>
        </motion.div>

        {/* Loading Indicator */}
        <div className="h-8">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-600">SINKRONISASI ANALYZER...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;