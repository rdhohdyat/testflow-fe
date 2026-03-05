import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import coding from "../../assets/coding.svg";
import { Code2, Search, BookOpen } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="px-8 py-20 bg-[#FAFBFF] dark:bg-zinc-900/10 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Bagian Ilustrasi */}
          <motion.div
            className="flex-1 relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-emerald-500/5 rounded-[3rem] blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
            <img
              src={coding}
              alt="Ilustrasi"
              className="relative w-full max-w-md mx-auto drop-shadow-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Bagian Teks */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 block">
              Filosofi Sistem
            </span>
            <h2 className="mb-6 text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight">
              Tentang <span className="italic text-zinc-900/10 dark:text-emerald-600">TestFlow</span>
            </h2>

            <p className="mb-8 text-lg text-zinc-400 font-medium leading-relaxed">
              Sebuah revolusi sederhana untuk membedah <span className="text-zinc-900 dark:text-white font-bold underline decoration-emerald-500/20">logika program</span> melalui visualisasi grafik yang intuitif dan presisi.
            </p>

            <Card className="rounded-[3rem] border-none bg-white shadow-2xl shadow-zinc-200/50 dark:shadow-none p-4">
              <CardContent className="flex flex-col gap-8 p-10">
                <div className="flex gap-6 items-start">
                  <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-200 dark:shadow-none dark:border">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-zinc-900 dark:text-emerald-600 mb-1 tracking-tight">Transformasi Kode</h4>
                    <p className="text-sm leading-relaxed text-zinc-400 font-medium">
                      Mengonversi Python menjadi Control Flow Graph (CFG) secara instan untuk transparansi logika yang maksimal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-100 dark:shadow-none">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-zinc-900 dark:text-emerald-600 mb-1 tracking-tight">Analisis Prefektur</h4>
                    <p className="text-sm leading-relaxed text-zinc-400 font-medium">
                      Deteksi Dead Code dan hitung kompleksitas siklomatik untuk memastikan kualitas kode Anda berada di level tertinggi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="p-4 rounded-2xl bg-zinc-50 text-zinc-400 dark:shadow-none">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-zinc-900 dark:text-emerald-600 mb-1 tracking-tight">Edukasi Visual</h4>
                    <p className="text-sm leading-relaxed text-zinc-400 font-medium">
                      Jembatan sempurna bagi mahasiswa dan pengembang untuk mendalami struktur data dan dokumentasi alur program.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;