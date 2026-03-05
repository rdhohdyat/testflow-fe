import { motion } from "framer-motion";
import FaQAccordion from "../faq-accordion";
import faqIllustration from "../../assets/faq.svg"

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      question: "Apa itu Control Flow Graph (CFG)?",
      answer:
        "Singkatnya, CFG adalah visualisasi alur program. Ini membantu kita melihat semua kemungkinan jalan yang bisa dilewati kode saat dijalankan.",
    },
    {
      question: "Apa kegunaan utama TestFlow?",
      answer:
        "TestFlow membantu melihat struktur logika kode secara visual, sehingga lebih mudah dipahami daripada hanya membaca teks baris per baris.",
    },
    {
      question: "Bagaimana cara aplikasi ini membuat CFG?",
      answer:
        "Aplikasi akan membaca kode Python Anda, mencari perintah seperti perulangan (loop) dan percabangan (if), lalu menghubungkannya menjadi sebuah CFG.",
    },
    {
      question: "Bahasa pemrograman apa saja yang didukung?",
      answer:
        "Untuk saat ini, fokus utama aplikasi adalah mendukung bahasa Python.",
    },
    {
      question: "Apakah saya bisa menyimpan hasil analisisnya?",
      answer:
        "Tentu! Anda bisa membuat proyek, menyimpan riwayat analisis, dan mengekspor hasilnya dalam format PDF berupa laporan.",
    },
    {
      question: "Apa itu Cyclomatic Complexity yang ada di aplikasi?",
      answer:
        "Itu adalah metrik sederhana untuk mengukur seberapa kompleks kode anda berdasarkan jumlah jalur yang ada di dalam CFG.",
    },
  ];

  return (
    <section id="faq" className="px-8 py-20 bg-white dark:bg-gray-900/10 overflow-hidden font-sans">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-4 block">
            Pusat Bantuan
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            Pertanyaan <span className="italic text-gray-900/10 dark:text-emerald-500">Sering</span> Diajukan
          </h2>
        </motion.div>

        <div className="grid items-start gap-20 lg:grid-cols-12">
          {/* Ilustrasi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block lg:col-span-5 sticky top-32"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img
                src={faqIllustration}
                alt="FAQ Ilustrasi"
                className="relative w-full max-w-md mx-auto opacity-90 drop-shadow-2xl group-hover:rotate-[-3deg] transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Daftar FAQ */}
          <div className="lg:col-span-7 space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FaQAccordion
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;