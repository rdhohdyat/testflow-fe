import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Home, LayoutDashboard, GitBranch } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Logo from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { cn } from "../lib/utils"; // Pastikan utilitas cn tersedia

const NAV_LINKS = [
  { label: "Tentang", href: "#about" },
  { label: "Cara Kerja", href: "#docs" },
  { label: "Fitur", href: "#service" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi scroll untuk efek glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWorkPage = location.pathname === "/work";
  const isDashboard = location.pathname === "/project";
  const isLandingPage = location.pathname === "/";

  const renderNavLinks = (isMobile = false) => (
    <div className={cn(
      "flex items-center gap-1",
      isMobile ? "flex-col items-start w-full gap-2" : "flex-row"
    )}>
      {isLandingPage && NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={getLinkClass(false, isMobile)}
        >
          {link.label.toUpperCase()}
        </a>
      ))}

      <div className={cn("flex items-center gap-2", isMobile && "mt-4 w-full justify-between px-2")}>
        <ModeToggle />
      </div>
    </div>
  );

  const getLinkClass = (isActive: boolean, isMobile = false) => cn(
    "text-sm font-semibold transition-all px-4 py-2 rounded-xl flex items-center gap-2",
    isActive
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
    isMobile && "w-full text-base py-3 px-4"
  );

  return (
    <nav className={cn(
      "fixed top-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] max-w-7xl rounded-3xl border",
      isScrolled
        ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl py-3 shadow-2xl shadow-zinc-200/50 dark:shadow-none border-zinc-100 dark:border-zinc-800"
        : "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md py-4 border-zinc-50 dark:border-zinc-800 shadow-xl shadow-zinc-100/50 dark:shadow-none"
    )}>
      <div className="flex items-center justify-between px-8 mx-auto">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Navigation Group */}
          <div className="items-center hidden gap-1 xl:flex">
            <Link to="/" className={getLinkClass(isLandingPage)}>
              <Home className="w-4 h-4" /> BERANDA
            </Link>

            <Link to="/project" className={getLinkClass(isDashboard)}>
              <LayoutDashboard className="w-4 h-4" /> PROJECT
            </Link>

            <Link to="/work" className={getLinkClass(isWorkPage)}>
              <GitBranch className="w-4 h-4" /> WORKSPACE
            </Link>
          </div>
        </div>

        {/* Right Side Desktop */}
        <div className="items-center hidden gap-4 xl:flex">
          {renderNavLinks(false)}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="xl:hidden h-10 w-10 rounded-xl" variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] rounded-l-[2rem]">
            <SheetHeader className="text-left px-2">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 mt-8">
              <div className="px-4 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Aplikasi
              </div>
              <Link to="/" className={getLinkClass(isLandingPage, true)}>
                <Home className="w-5 h-5" /> BERANDA
              </Link>
              <Link to="/project" className={getLinkClass(isDashboard, true)}>
                <LayoutDashboard className="w-5 h-5" /> PROJECT
              </Link>
              <Link to="/work" className={getLinkClass(isWorkPage, true)}>
                <GitBranch className="w-5 h-5" /> WORKSPACE
              </Link>

              <div className="my-4 border-t border-neutral-100 dark:border-neutral-800 mx-2" />

              <div className="px-4 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Informasi
              </div>
              {renderNavLinks(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};