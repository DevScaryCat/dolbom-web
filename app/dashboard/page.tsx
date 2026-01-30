// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Wallet, Plus } from "lucide-react";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
            }
        };
        getProfile();
    }, []);

    // [핵심] 원화 포맷터 (예: 50000 -> ₩50,000)
    const formatKRW = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-zinc-400 mb-8">유전체 분석 파이프라인 현황입니다.</p>

                {/* 잔액 카드 */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 w-full max-w-sm hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500">
                                <Wallet size={20} />
                            </div>
                            <span className="text-zinc-400 font-medium text-sm uppercase tracking-wide">Current Balance</span>
                        </div>
                        <button className="text-xs flex items-center gap-1 bg-white text-black px-2 py-1 rounded hover:bg-zinc-200 transition font-bold">
                            <Plus size={12} /> 충전
                        </button>
                    </div>

                    <div className="text-4xl font-bold text-white tracking-tight">
                        {profile ? formatKRW(profile.balance) : "..."}
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                        * 분석 1회당 약 ₩2.8 차감
                    </p>
                </div>

                {/* 여기에 차트나 분석 리스트 등이 들어갑니다 */}

            </div>
        </div>
    );
}