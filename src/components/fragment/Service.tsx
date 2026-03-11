import { motion } from "framer-motion";
import ServiceCard from "../service-card";
import { GitFork, ListTree, CheckCircle2 } from "lucide-react";

type ServiceItem = {
  title: string;
  icon: any;
  description: string;
};

const Service = () => {
  const services: ServiceItem[] = [
    {
      title: "Pembuatan CFG",
      icon: <GitFork />,
      description:
        "Otomatis memetakan kode Python anda menjadi Control Flow Graph (CFG) untuk analisis visual.",
    },
    {
      title: "Jalur Independen & Kompleksitas",
      icon: <ListTree />,
      description:
        "Mendeteksi dan menghitung Cyclomatic Complexity serta menampilkan jalur independen.",
    },
    {
      title: "Eksekusi Test Case",
      icon: <CheckCircle2 />,
      description:
        "Simulasikan eksekusi jalur independen dengan input test case.",
    },
  ];

  return (
    <section id="service" className="px-8 py-20 bg-neutral-50 dark:bg-neutral-950 font-sans">
      <div className="container flex flex-col items-center max-w-6xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 block">
            Fitur Inti
          </span>
          <h2 className="mb-5 text-2xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter leading-tight">
            Analisis <span className="italic text-emerald-500">Kode</span>
          </h2>
          <p className="max-w-xl mb-12 text-sm sm:text-lg text-neutral-400 font-medium leading-relaxed mx-auto">
            Beberapa hal yang bisa anda lakukan di <span className="text-neutral-900 dark:text-white font-bold">TestFlow</span> untuk membantu mempermudah analisis logika program.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;