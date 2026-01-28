// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dna, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Pipeline", path: "/" },
        { name: "Documentation", path: "/docs" },
        { name: "Console", path: "/dashboard" }, // 나중에 만들 예정
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group">
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

                {/* Right Area (GitHub / Login) */}
                <div className="flex items-center gap-4">
                    <Link href="https://github.com/DevScaryCat" target="_blank" className="text-zinc-400 hover:text-white transition">
                        <Github size={20} />
                    </Link>
                    <button className="hidden sm:block px-4 py-1.5 text-xs font-semibold text-black bg-white rounded-full hover:bg-zinc-200 transition">
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
}