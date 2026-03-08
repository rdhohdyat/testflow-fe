import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="px-8 pb-10 bg-white dark:bg-neutral-950 font-sans">
      <div className="container mx-auto p-10 md:p-14 bg-neutral-50 dark:bg-neutral-900 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">

          <div className="max-w-xs">
            <a href="/" className="inline-block mb-6 hover:scale-105 transition-transform">
              <Logo />
            </a>
            <p className="text-sm font-medium text-neutral-400">
              © 2025 Ridho Hidayat. <br />
              Dibuat untuk tugas Proyek Akhir.
            </p>
          </div>

          {/* Link Navigasi Cepat */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-300 dark:text-neutral-600">Produk</h4>
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Beranda</a>
                <a href="#about" className="text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Tentang</a>
                <a href="#service" className="text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Fitur</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-300 dark:text-neutral-600">Dukungan</h4>
              <nav className="flex flex-col gap-4">
                <a href="#docs" className="text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">Panduan</a>
                <a href="#faq" className="text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors">FAQ</a>
              </nav>
            </div>
          </div>

          {/* Social Connect */}
          <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-300 dark:text-neutral-600">Media Sosial</h4>
            <div className="flex items-center gap-4">
              <a href="https://github.com/rdhohdyat" target="_blank" rel="noreferrer">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-emerald-600 text-white hover:bg-neutral-800 dark:hover:bg-emerald-700 shadow-xl shadow-neutral-200 dark:shadow-none hover:-translate-y-1 transition-all">
                  <Github className="h-6 w-6" />
                </Button>
              </a>
              <Button size="icon" className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 shadow-xl shadow-emerald-50 dark:shadow-none border border-emerald-100 dark:border-emerald-500/20 hover:-translate-y-1 transition-all">
                <Twitter className="h-6 w-6" />
              </Button>
              <a href="mailto:email@kamu.com">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:-translate-y-1 transition-all dark:shadow-none">
                  <Mail className="h-6 w-6" />
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