import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="px-8 pb-10 bg-white font-sans">
      <div className="container mx-auto p-10 md:p-14 bg-[#FAFBFF] rounded-[3rem] border border-zinc-50 shadow-2xl shadow-zinc-200/50">
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
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300">Produk</h4>
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-lg font-black tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">Beranda</a>
                <a href="#about" className="text-lg font-black tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">Tentang</a>
                <a href="#service" className="text-lg font-black tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">Fitur</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300">Dukungan</h4>
              <nav className="flex flex-col gap-4">
                <a href="#docs" className="text-lg font-black tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">Panduan</a>
                <a href="#faq" className="text-lg font-black tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">FAQ</a>
              </nav>
            </div>
          </div>

          {/* Social Connect */}
          <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
            <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-300">Media Sosial</h4>
            <div className="flex items-center gap-4">
              <a href="https://github.com/rdhohdyat" target="_blank" rel="noreferrer">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 hover:-translate-y-1 transition-all">
                  <Github className="h-6 w-6" />
                </Button>
              </a>
              <Button size="icon" className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-xl shadow-emerald-50 border border-emerald-100 hover:-translate-y-1 transition-all">
                <Twitter className="h-6 w-6" />
              </Button>
              <a href="mailto:email@kamu.com">
                <Button size="icon" className="w-14 h-14 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-900 hover:bg-zinc-50 hover:-translate-y-1 transition-all">
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