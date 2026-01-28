// app/docs/page.tsx
"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">

            {/* Header */}
            <section className="border-b border-white/5 bg-zinc-900/10">
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-emerald-400 font-mono text-sm mb-4">DEVELOPER DOCUMENTATION</p>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Pipeline Integration</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            Dolbom AI 파이프라인을 귀사의 서비스에 연동하는 방법입니다.<br />
                            REST API를 통해 유전체 데이터(VCF)를 전송하고, 분석 결과를 수신하세요.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12">

                {/* Sidebar Navigation */}
                <aside className="hidden md:block sticky top-24 h-fit">
                    <nav className="flex flex-col gap-1 text-sm text-zinc-400">
                        <p className="font-semibold text-white mb-3 px-2">Getting Started</p>
                        <a href="#overview" className="hover:text-emerald-400 px-2 py-1.5 rounded hover:bg-white/5 transition">Overview</a>
                        <a href="#authentication" className="hover:text-emerald-400 px-2 py-1.5 rounded hover:bg-white/5 transition">Authentication</a>
                        <p className="font-semibold text-white mt-6 mb-3 px-2">Core API</p>
                        <a href="#analyze" className="hover:text-emerald-400 px-2 py-1.5 rounded hover:bg-white/5 transition">Analyze VCF</a>
                        <a href="#webhook" className="hover:text-emerald-400 px-2 py-1.5 rounded hover:bg-white/5 transition">Webhooks</a>
                    </nav>
                </aside>

                {/* Main Docs Content */}
                <div className="space-y-16">

                    {/* Section: Overview */}
                    <section id="overview">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">01</span>
                            System Overview
                        </h2>
                        <p className="text-zinc-400 leading-relaxed mb-6">
                            Dolbom AI Pipeline은 <strong>AWS Batch</strong>와 <strong>Nextflow</strong>를 기반으로 구축된 클라우드 네이티브 분석 시스템입니다.
                            대용량 VCF 파일을 비동기(Asynchronous) 방식으로 처리하며, 처리 단계는 다음과 같습니다.
                        </p>
                        <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl text-sm font-mono text-zinc-300 space-y-2">
                            <div className="flex gap-4">
                                <span className="text-zinc-500">Step 1</span>
                                <span>Upload VCF to S3 Bucket</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-zinc-500">Step 2</span>
                                <span>Low-Pass Imputation (Beagle 5.4)</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-zinc-500">Step 3</span>
                                <span>Risk Scoring Engine (Python/Pandas)</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-zinc-500">Step 4</span>
                                <span>Generate CSV Report</span>
                            </div>
                        </div>
                    </section>

                    {/* Section: API Example */}
                    <section id="analyze">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">02</span>
                            Analyze VCF
                        </h2>
                        <p className="text-zinc-400 mb-6">
                            새로운 분석 작업을 요청합니다. 작업 ID(jobId)가 즉시 반환되며, 실제 분석은 백그라운드에서 수행됩니다.
                        </p>

                        {/* Code Block Component */}
                        <CodeBlock
                            lang="bash"
                            filename="Terminal"
                            code={`curl -X POST https://api.dolbom.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dog_name": "Poppi",
    "breed": "Maltese",
    "age_months": 96,
    "vcf_url": "s3://your-bucket/sample.vcf.gz"
  }'`}
                        />

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-zinc-300 mb-2">Response Example</p>
                            <CodeBlock
                                lang="json"
                                filename="Response"
                                code={`{
  "status": "queued",
  "job_id": "job_12345_abcde",
  "estimated_time": "120s",
  "message": "Analysis started successfully."
}`}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

// Helper: Code Block Component with Copy
function CodeBlock({ code, lang, filename }: { code: string, lang: string, filename: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0D0D0D]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-mono">{filename}</span>
                </div>
                <button onClick={handleCopy} className="text-zinc-500 hover:text-white transition">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                    <code className="language-bash text-zinc-300">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}