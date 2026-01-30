// app/signup/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Lock, Mail, ArrowRight, Github, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// [설정] 8자리 코드
const OTP_LENGTH = 8;

export default function SignupPage() {
    const router = useRouter();

    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (step === 'verify') {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 500);
        }
    }, [step]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setStep('verify');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = otp.join("");

        if (token.length !== OTP_LENGTH) {
            setError(`${OTP_LENGTH}자리 코드를 모두 입력해주세요.`);
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup',
            });

            if (error) throw error;

            router.refresh();
            router.push("/dashboard");

        } catch (err: any) {
            setError("인증 코드가 올바르지 않거나 만료되었습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
        if (pastedData.every(char => !isNaN(Number(char)))) {
            const newOtp = [...otp];
            pastedData.forEach((val, i) => {
                if (i < OTP_LENGTH) newOtp[i] = val;
            });
            setOtp(newOtp);
            const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                layout // [핵심] 크기 변경 시 부드럽게 애니메이션
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    // [핵심] 인증 단계일 때 너비를 넓힘 (max-w-md -> max-w-lg)
                    width: step === 'verify' ? '100%' : '100%',
                    maxWidth: step === 'verify' ? '32rem' : '28rem'
                }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 mx-auto"
            >
                <div className="flex justify-center mb-6">
                    <Link href="/" className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Dna size={32} className="text-blue-500" />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {step === 'form' ? '회원가입' : '이중 인증'}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {step === 'form'
                            ? '회원가입 후 돌봄 AI를 실제 사용해보세요'
                            : `이메일(${email})로 전송된 코드를 입력하세요`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div
                            key="signup-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">이메일</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                                            placeholder="researcher@dolbom.cloud"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">비밀번호</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                                            placeholder="비밀번호 입력"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">비밀번호 재입력</label>
                                    <div className="relative group">
                                        <CheckCircle2 className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${confirmPassword && password === confirmPassword ? "text-green-500" : "text-zinc-500"}`} size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full bg-black/50 border rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all text-sm ${confirmPassword && password !== confirmPassword
                                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                                                : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50"
                                                }`}
                                            placeholder="비밀번호 재입력"
                                            required
                                        />
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-[10px] text-red-400 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-900/20"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>인증 코드 받기 <ArrowRight size={18} /></>}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="text-zinc-500 bg-[#0c0c0e] px-2">소셜 계정으로 가입</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSocialLogin('github')}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300 transition-colors"
                                >
                                    <Github size={18} /> GitHub
                                </button>
                                <button
                                    onClick={() => handleSocialLogin('google')}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300 transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Google
                                </button>
                            </div>

                            <p className="text-center mt-8 text-xs text-zinc-500">
                                이미 계정이 있으신가요? <Link href="/login" className="text-blue-400 hover:underline">로그인</Link>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="verify-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <form onSubmit={handleVerify} className="space-y-8">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-200">
                                    <p className="text-center">이메일로 전송된 {OTP_LENGTH}자리 코드를 입력해주세요.</p>
                                </div>

                                {/* [핵심] 간격(gap-1)과 박스 너비를 모바일/데스크탑에 맞춰 촘촘하게 조정 */}
                                <div className="flex justify-center gap-1 sm:gap-2">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                value={data}
                                                onChange={(e) => handleChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onPaste={handlePaste}
                                                // [핵심] 모바일에서는 w-8, 데스크탑에서는 w-10으로 크기 최적화
                                                className="w-8 h-10 sm:w-10 sm:h-14 border border-zinc-700 bg-zinc-900/50 rounded-lg sm:rounded-xl text-center text-lg sm:text-2xl font-bold text-white 
                                                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
                                                         outline-none transition-all duration-200 selection:bg-transparent"
                                            />
                                        );
                                    })}
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-900/20"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>인증 완료 및 가입 <CheckCircle2 size={18} /></>}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('form')}
                                    className="w-full text-zinc-500 text-xs hover:text-white transition-colors mt-4"
                                >
                                    ← 이메일 다시 입력하기
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main >
    );
}