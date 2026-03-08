import { motion } from "framer-motion";
import StepCard from "../step-card";
import { ChartGantt, Code, Combine, GitCommitVertical, GitFork, Wallpaper } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: any;
};

const Docs = () => {
  const steps: Step[] = [
    {
      title: "Parsing Kode",
      description: "Mentransformasi kode Python menjadi struktur data pohon (AST).",
      icon: <Code />,
    },
    {
      title: "Analisis Struktur",
      description: "Mengidentifikasi perintah, percabangan (if), dan perulangan (loop).",
      icon: <ChartGantt />,
    },
    {
      title: "Blok Logika",
      description: "Mengelompokkan baris kode ke dalam unit eksekusi.",
      icon: <Combine />,
    },
    {
      title: "Pembuatan Node",
      description: "Mengubah unit eksekusi menjadi titik (node) dalam CFG.",
      icon: <GitCommitVertical />,
    },
    {
      title: "Pemetaan Alur",
      description: "Menghubungkan antar titik sesuai dengan logika alur program.",
      icon: <GitFork />,
    },
    {
      title: "Render CFG",
      description: "Menampilkan CFG yang informatif dan visual.",
      icon: <Wallpaper />,
    },
  ];

  return (
    <section id="docs" className="px-8 py-20 bg-white dark:bg-zinc-900/50 overflow-hidden font-sans">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 block">
            Panduan Penggunaan
          </span>
          <h2 className="mb-6 text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
            Cara <span className="italic text-emerald-500">Kerja</span> TestFlow
          </h2>
          <p className="text-lg text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Saksikan demonstrasi singkat bagaimana TestFlow bekerja.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200 dark:shadow-none group border-2 border-zinc-50 dark:border-zinc-800"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <iframe
            src="https://www.youtube.com/embed/QOfdD0FlJJI"
            title="Demo TestFlow"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
      </div>

      <div className="container max-w-7xl mx-auto mt-24 relative">
        {/* Decorative background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-6 text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
            Arsitektur <span className="text-emerald-500 italic">Logika</span>
          </h2>
          <p className="text-base text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Alur kerja yang mengubah baris kode Anda menjadi wawasan visual yang mendalam.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
                index={index + 1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Docs;