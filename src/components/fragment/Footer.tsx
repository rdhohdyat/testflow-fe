import { Github, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="sm:px-8 pb-10 bg-white dark:bg-neutral-950 font-sans">
      <div className="container mx-auto p-6 md:p-14 bg-white dark:bg-neutral-900 sm:rounded-[3rem] sm:border border-t border-neutral-200 dark:border-neutral-800 sm:shadow-lg shadow-neutral-200/50 dark:shadow-none">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">

          <div className="max-w-xs">
            <a href="/" className="inline-block mb-6 hover:scale-105 transition-transform">
              <Logo />
            </a>
            <p className="text-sm font-medium text-neutral-500">
              © 2025 Ridho Hidayat. <br />
              Dibuat untuk tugas Proyek Akhir.
            </p>
          </div>

          {/* Link Navigasi Cepat */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600">Produk</h4>
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-sm sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Beranda</a>
                <a href="#about" className="text-sm sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Tentang</a>
                <a href="#service" className="text-sm sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Fitur</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-600">Dukungan</h4>
              <nav className="flex flex-col gap-4">
                <a href="#docs" className="text-sm sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Panduan</a>
                <a href="#faq" className="text-sm sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">FAQ</a>
              </nav>
            </div>
          </div>

          {/* Social Connect */}
          <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-300 dark:text-neutral-600">Media Sosial</h4>
            <div className="flex items-center gap-4">
              <a href="https://github.com/rdhohdyat" target="_blank" rel="noreferrer">
                <Button size="icon" className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-neutral-900 dark:bg-emerald-600 text-white hover:bg-neutral-800 dark:hover:bg-emerald-700 shadow-xl shadow-neutral-200 dark:shadow-none hover:-translate-y-1 transition-all">
                  <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </a>
              <a href="mailto:rdho.hdyat@gmail.com">
                <Button size="icon" className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:-translate-y-1 transition-all dark:shadow-none">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;