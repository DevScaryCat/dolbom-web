// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dna, Github, UserCircle, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";

// [핵심] 부모(Layout)로부터 user를 받을 준비
interface NavbarProps {
    user: User | null;
}

// [핵심] props로 user를 받아서 초기값으로 설정
export default function Navbar({ user: initialUser }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();

    // [핵심] useState의 초기값을 null이 아니라 서버에서 받은 initialUser로 설정!
    const [user, setUser] = useState<User | null>(initialUser);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // [참고] 서버에서 이미 가져왔지만, 
        // 클라이언트 사이드에서의 변화(로그아웃 등)를 감지하기 위해 리스너는 유지합니다.
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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                        <Dna size={20} className="text-emerald-500" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">
                        Dolbom<span className="text-zinc-500"> AI</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
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

                {/* Right Area */}
                <div className="flex items-center gap-4">
                    <Link href="https://github.com/DevScaryCat" target="_blank" className="text-zinc-400 hover:text-white transition">
                        <Github size={20} />
                    </Link>

                    {/* User Menu Area */}
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white border rounded-full transition-all ${isMenuOpen
                                        ? "bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/20"
                                        : "bg-zinc-900 border-white/10 hover:bg-zinc-800"
                                    }`}
                            >
                                <UserCircle size={16} className="text-emerald-400" />
                                <span className="max-w-[100px] truncate hidden sm:inline">
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
                            className="hidden sm:block px-4 py-1.5 text-xs font-semibold text-black bg-white rounded-full hover:bg-zinc-200 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}