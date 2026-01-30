// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Github, UserCircle, LogOut, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = ["/login", "/signup"].includes(pathname);

    const [user, setUser] = useState<User | null>(initialUser);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) setIsMenuOpen(false);
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
        router.refresh();
        router.push("/");
    };

    const navItems = [
        { name: "Pipeline", path: "/" },
        { name: "Documentation", path: "/docs" },
    ];

    // [인증 페이지용 Navbar]
    if (isAuthPage) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group pointer-events-auto">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                            <Image
                                src="/logo-no-bg.png"
                                alt="Dolbom AI Logo"
                                width={25}
                                height={25}
                                className="size-7 object-contain"
                            />
                        </div>
                    </Link>
                </div>
            </nav>
        );
    }

    // [메인 Navbar]
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">

                {/* 1. Logo (왼쪽) */}
                <div className="flex items-center z-50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                            <Image
                                src="/logo-no-bg.png"
                                alt="Dolbom AI Logo"
                                width={25}
                                height={25}
                                className="size-7 object-contain"
                            />
                        </div>
                    </Link>
                </div>

                {/* 2. Desktop Navigation (완전 중앙 정렬) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 z-40">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="relative px-4 py-2 text-sm font-medium transition-colors"
                            >
                                <span className={isActive ? "text-white" : "text-zinc-400 hover:text-white"}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-white/5 rounded-lg -z-10 border border-white/10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* 3. Right Area (오른쪽) */}
                <div className="flex items-center gap-3 z-50">
                    <Link href="https://github.com/DevScaryCat" target="_blank" className="hidden sm:block text-zinc-400 hover:text-white transition">
                        <Github size={20} />
                    </Link>

                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs font-semibold text-white border rounded-full transition-all ${isMenuOpen
                                    ? "bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/20"
                                    : "bg-zinc-900 border-white/10 hover:bg-zinc-800"
                                    }`}
                            >
                                <UserCircle size={16} className="text-emerald-400" />
                                <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                                    {user.email?.split('@')[0]}
                                </span>
                                <ChevronDown
                                    size={12}
                                    className={`text-zinc-500 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 mt-2 w-48 py-1 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm text-white truncate font-medium">{user.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <LayoutDashboard size={16} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                                            >
                                                <LogOut size={16} className="group-hover:text-red-300 transition-colors" />
                                                Log out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-1.5 text-xs font-semibold text-black bg-white rounded-full hover:bg-zinc-200 transition"
                        >
                            Login
                        </Link>
                    )}

                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-white/5 bg-black/95 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-white/10 text-white"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <Link href="https://github.com/DevScaryCat" target="_blank" className="px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2">
                                <Github size={18} />
                                GitHub Repository
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}