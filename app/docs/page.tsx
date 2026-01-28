// app/docs/page.tsx
"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("overview");

    // 스크롤 감지 (Scroll Spy)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -50% 0px" }
        );

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 120,
                behavior: "smooth",
            });
            setActiveSection(id);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">

            {/* 1. Header Section */}
            <section className="border-b border-white/5 bg-zinc-900/10 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            {/* [Color Fix] Blue -> Emerald */}
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-emerald-400 font-mono text-sm tracking-wider">DEVELOPER API</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Pipeline Integration</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            Learn how to integrate the Dolbom AI Pipeline into your service.<br />
                            Submit genomic data (VCF) via REST API and receive analysis results.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Main Layout (2-Column Grid) */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12 py-12">

                    {/* [Left Sidebar] Navigation + Sub-menu TOC */}
                    <aside className="hidden md:block h-fit sticky top-24">
                        <nav className="flex flex-col gap-8 pr-4 border-r border-white/5">

                            {/* Group 1 */}
                            <div>
                                <p className="font-bold text-white mb-4 text-sm tracking-wide">Getting Started</p>
                                <div className="flex flex-col space-y-1 text-sm text-zinc-400">
                                    <MenuLink>Introduction</MenuLink>
                                    <MenuLink>Authentication</MenuLink>
                                    <MenuLink>Errors</MenuLink>
                                </div>
                            </div>

                            {/* Group 2 (Active Page) */}
                            <div>
                                <p className="font-bold text-white mb-4 text-sm tracking-wide">Core Resources</p>
                                <div className="flex flex-col space-y-1 text-sm text-zinc-400">

                                    {/* 현재 페이지 (Active) */}
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-white font-medium py-2 px-2 bg-white/5 rounded-lg">
                                            {/* [Color Fix] Blue -> Emerald */}
                                            <ChevronRight size={14} className="text-emerald-400" />
                                            Pipeline API
                                        </span>

                                        {/* On this page 하위 메뉴 */}
                                        <div className="flex flex-col mt-2 ml-2 pl-4 border-l border-white/10 space-y-2">
                                            <button
                                                onClick={() => scrollToSection("overview")}
                                                className={`text-left transition-colors text-xs py-1 ${activeSection === "overview" ? "text-emerald-400 font-medium" : "text-zinc-500 hover:text-zinc-300"
                                                    }`}
                                            >
                                                시스템 개요
                                            </button>
                                            <button
                                                onClick={() => scrollToSection("analyze")}
                                                className={`text-left transition-colors text-xs py-1 ${activeSection === "analyze" ? "text-emerald-400 font-medium" : "text-zinc-500 hover:text-zinc-300"
                                                    }`}
                                            >
                                                VCF 분석 요청
                                            </button>
                                        </div>
                                    </div>

                                    <MenuLink>Webhooks</MenuLink>
                                    <MenuLink>Rate Limits</MenuLink>
                                </div>
                            </div>

                        </nav>
                    </aside>

                    {/* [Center] Main Content */}
                    <div className="min-h-screen space-y-24">

                        {/* Section 1: System Overview */}
                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-mono">01</span>
                                시스템 개요
                            </h2>
                            <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                                Dolbom AI 파이프라인은 <strong className="text-white">AWS Batch</strong>와 <strong className="text-white">Nextflow</strong>를 기반으로 구축된 클라우드 네이티브 분석 시스템입니다.
                                대용량 VCF 파일을 비동기(Asynchronous) 방식으로 처리하며, 처리 단계는 다음과 같습니다.
                            </p>

                            <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl text-base font-mono space-y-5 shadow-lg">
                                <div className="flex gap-6 items-center">
                                    <span className="text-zinc-600 font-bold select-none w-16">Step 1</span>
                                    <span className="text-zinc-300">S3 버킷에 VCF 파일 업로드</span>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>

                                <div className="flex gap-6 items-center">
                                    <span className="text-zinc-600 font-bold select-none w-16">Step 2</span>
                                    <span className="text-zinc-300">저심도 복원 (Beagle 5.4 Imputation)</span>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>

                                <div className="flex gap-6 items-center">
                                    <span className="text-zinc-600 font-bold select-none w-16">Step 3</span>
                                    <span className="text-zinc-300">리스크 스코어링 엔진 (Python/Pandas)</span>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>

                                <div className="flex gap-6 items-center">
                                    <span className="text-zinc-600 font-bold select-none w-16">Step 4</span>
                                    <span className="text-zinc-300">최종 CSV 리포트 생성</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Analyze VCF */}
                        <section id="analyze" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                                {/* [Color Fix] Blue -> Emerald */}
                                <span className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-mono">02</span>
                                VCF 분석 요청
                            </h2>
                            <p className="text-zinc-400 mb-8 text-lg">
                                새로운 분석 작업을 요청합니다. 이 작업은 비동기로 처리되며, 요청 즉시 <strong>Job ID</strong>가 반환됩니다.
                            </p>

                            <CodeBlock
                                lang="bash"
                                filename="Request"
                                code={`curl -X POST https://api.dolbom.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dog_name": "Poppi",
    "breed": "Maltese",
    "vcf_url": "s3://bucket/sample.vcf.gz"
  }'`}
                            />

                            <div className="mt-8">
                                <p className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider pl-1">응답 예시</p>
                                <CodeBlock
                                    lang="json"
                                    filename="Response"
                                    code={`{
  "status": "queued",
  "job_id": "job_12345_abcde",
  "estimated_time": "120s"
}`}
                                />
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}

// --- Components ---

function MenuLink({ children }: { children: React.ReactNode }) {
    return (
        <a href="#" className="py-2 px-2 hover:bg-white/5 rounded-lg hover:text-white transition-colors">
            {children}
        </a>
    )
}

function CodeBlock({ code, lang, filename }: { code: string, lang: string, filename: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl group w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-mono uppercase">{filename}</span>
                </div>
                <button onClick={handleCopy} className="text-zinc-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                    {/* [Color Fix] Blue -> Emerald */}
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-zinc-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}