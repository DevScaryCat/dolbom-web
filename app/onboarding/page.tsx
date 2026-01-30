// app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Building2, ArrowRight, Wallet, Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [organization, setOrganization] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
        };
        getUser();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // [핵심] 정보 저장 및 온보딩 완료 처리
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    organization: organization,
                    is_onboarded: true, // 탈출!
                })
                .eq("id", user.id);

            if (error) throw error;

            router.refresh();
            router.push("/dashboard");

        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* 배경 효과 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold mb-4">
                        STEP 1 OF 1
                    </span>
                    <h1 className="text-3xl font-bold text-white mb-3">환영합니다!</h1>
                    <p className="text-zinc-400 text-lg">
                        <span className="text-white font-medium">{userEmail}</span>님,<br />
                        원활한 분석 의뢰를 위해 기본 정보를 설정해주세요.
                    </p>
                </div>

                {/* 웰컴 보너스 카드 */}
                <div className="mb-8 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-full text-black">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Welcome Gift</p>
                        <p className="text-white font-bold text-lg">₩50,000 지급 대기 중</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">이름 (Full Name)</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                placeholder="홍길동"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">소속 (Organization / Lab)</label>
                        <div className="relative group">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                placeholder="Dolbom Univ. Bio Lab"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>설정 완료하고 시작하기 <ArrowRight /></>}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}