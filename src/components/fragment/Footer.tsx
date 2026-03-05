import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="px-8 pb-10 bg-white dark:bg-gray-950 font-sans">
      <div className="container mx-auto p-10 md:p-14 bg-[#FAFBFF] dark:bg-gray-900 rounded-[3rem] border border-zinc-50 dark:border-gray-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">

          <div className="max-w-xs">
            <a href="/" className="inline-block mb-6 hover:scale-105 transition-transform">
              <Logo />
            </a>
            <p className="text-sm font-medium text-zinc-400">
              © 2025 Ridho Hidayat. <br />
              Dibuat untuk tugas Proyek Akhir.
            </p>
          </div>

          {/* Link Navigasi Cepat */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300 dark:text-gray-600">Produk</h4>
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">Beranda</a>
                <a href="#about" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">Tentang</a>
                <a href="#service" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">Fitur</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300 dark:text-gray-600">Dukungan</h4>
              <nav className="flex flex-col gap-4">
                <a href="#docs" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">Panduan</a>
                <a href="#faq" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors">FAQ</a>
              </nav>
            </div>
          </div>

          {/* Social Connect */}
          <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300 dark:text-gray-600">Media Sosial</h4>
            <div className="flex items-center gap-4">
              <a href="https://github.com/rdhohdyat" target="_blank" rel="noreferrer">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-emerald-600 text-white hover:bg-zinc-800 dark:hover:bg-emerald-700 shadow-xl shadow-zinc-200 dark:shadow-none hover:-translate-y-1 transition-all">
                  <Github className="h-6 w-6" />
                </Button>
              </a>
              <Button size="icon" className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 shadow-xl shadow-emerald-50 dark:shadow-none border border-emerald-100 dark:border-emerald-500/20 hover:-translate-y-1 transition-all">
                <Twitter className="h-6 w-6" />
              </Button>
              <a href="mailto:email@kamu.com">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border-2 border-zinc-100 dark:border-gray-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-gray-700 hover:-translate-y-1 transition-all dark:shadow-none">
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