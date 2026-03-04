import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    GitBranch,
    Settings,
    LogOut,
    FolderOpen,
    Home
} from "lucide-react";
import { cn } from "../lib/utils";
import Logo from "./Logo";

const SIDEBAR_ITEMS = [
    { icon: Home, label: "Beranda", href: "/" },
    { icon: LayoutDashboard, label: "Project", href: "/project" },
    { icon: GitBranch, label: "Workspace", href: "/work" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-100 bg-white p-6 hidden lg:flex flex-col gap-8 shadow-sm">
            <div className="px-2">
                <Logo />
            </div>

            <nav className="flex-1 space-y-2">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                        Menu Utama
                    </span>
                </div>
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "bg-white shadow-xl shadow-emerald-100/50 text-emerald-600 font-bold"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-900"
                            )} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2 pt-4 border-t border-zinc-100">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Keluar</span>
                </button>
            </div>
        </aside>
    );
}
