// app/page.tsx
"use client";

import { motion } from "framer-motion";
import { Dna, Activity, Server, ChevronRight, Database, Cpu, Network, FileCode, Zap, Globe } from "lucide-react";

// [Data] 스트림 아이템
const STREAM_ITEMS = [
  { icon: <Server size={20} />, label: "AWS Batch", sub: "Compute Env" },
  { icon: <FileCode size={20} />, label: "Nextflow", sub: "Workflow" },
  { icon: <Dna size={20} />, label: "Beagle 5.4", sub: "Imputation" },
  { icon: <Database size={20} />, label: "CIS Statistics", sub: "Insurance Data" },
  { icon: <Cpu size={20} />, label: "Python 3.9", sub: "Risk Engine" },
  { icon: <Network size={20} />, label: "Seqera Platform", sub: "Monitoring" },
  { icon: <Activity size={20} />, label: "Real-time Inference", sub: "Analysis" },
  { icon: <Zap size={20} />, label: "Low-Pass WGS", sub: "Cost Innovation" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">

      {/* =========================================
          1. Hero Section: Circuit Grid & Flow
      ========================================= */}
      <section className="relative flex flex-col items-center justify-center h-screen px-4 overflow-hidden border-b border-white/5">

        {/* [Background] Grid Pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* [Animation] Circuit Data Flow */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <CircuitDot path={[{ x: '0vw', y: '15vh' }, { x: '30vw', y: '15vh' }, { x: '30vw', y: '45vh' }, { x: '100vw', y: '45vh' }]} duration={15} delay={0} />
          <CircuitDot path={[{ x: '10vw', y: '100vh' }, { x: '10vw', y: '60vh' }, { x: '40vw', y: '60vh' }, { x: '40vw', y: '30vh' }]} duration={12} delay={2} />
          <CircuitDot path={[{ x: '90vw', y: '0vh' }, { x: '90vw', y: '30vh' }, { x: '60vw', y: '30vh' }, { x: '60vw', y: '80vh' }]} duration={18} delay={1} />
          <CircuitDot path={[{ x: '-10vw', y: '85vh' }, { x: '50vw', y: '85vh' }, { x: '50vw', y: '55vh' }, { x: '110vw', y: '55vh' }]} duration={20} delay={5} />
          <CircuitDot path={[{ x: '0vw', y: '25vh' }, { x: '100vw', y: '25vh' }]} duration={8} delay={3} />
        </div>

        {/* [Mask] & [Effect] */}
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_0%,#000_100%)] z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_50%)] z-0" />

        {/* --- Hero Content --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium text-emerald-400 border border-emerald-500/20 rounded-full bg-emerald-500/5 backdrop-blur-sm">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
            </span>
            Dolbom Pipeline v1.0 Operational
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
            Predicting the <br />
            <span className="text-emerald-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.6)]">Unseen Risk</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            반려동물 생체 데이터의 미래.<br />
            <span className="text-zinc-200">AWS 클라우드 파이프라인</span>과 <span className="text-zinc-200">한국형 유전체 AI</span>로<br />
            보이지 않는 질병을 미리 발견합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Start Diagnosis <ChevronRight size={18} />
            </button>
            <button className="px-8 py-4 bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition backdrop-blur-sm">
              View Architecture
            </button>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          2. Infinite Stream Section
      ========================================= */}
      <section className="py-20 border-b border-white/5 bg-zinc-900/10 backdrop-blur-sm relative overflow-hidden">
        <div className="text-center mb-10 relative z-10">
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-500 uppercase drop-shadow-sm">
            Live Processing Pipeline
          </p>
        </div>

        <div
          className="flex relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}
        >
          <div className="flex animate-scroll whitespace-nowrap gap-6 py-4 pr-6">
            {STREAM_ITEMS.map((item, idx) => <StreamCard key={`a-${idx}`} item={item} />)}
            {STREAM_ITEMS.map((item, idx) => <StreamCard key={`a2-${idx}`} item={item} />)}
          </div>
          <div className="flex animate-scroll whitespace-nowrap gap-6 py-4 pr-6" aria-hidden="true">
            {STREAM_ITEMS.map((item, idx) => <StreamCard key={`b-${idx}`} item={item} />)}
            {STREAM_ITEMS.map((item, idx) => <StreamCard key={`b2-${idx}`} item={item} />)}
          </div>
        </div>
      </section>

      {/* =========================================
          [NEW] 2.5 Global Network Globe Section
      ========================================= */}
      <section className="py-32 relative overflow-hidden border-b border-white/5">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">

          {/* Left: Globe Animation */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">

              {/* Globe Container (Rotating) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border border-blue-500/20 relative flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.1)]"
              >
                {/* Meridians (경도선 - 타원형으로 표현) */}
                <div className="absolute w-[100%] h-[100%] rounded-full border border-blue-400/10" />
                <div className="absolute w-[70%] h-[100%] rounded-[50%] border border-blue-400/20" />
                <div className="absolute w-[40%] h-[100%] rounded-[50%] border border-blue-400/20" />
                <div className="absolute w-[10%] h-[100%] rounded-[50%] border border-blue-400/10" />

                {/* Equator (적도) */}
                <div className="absolute w-[100%] h-[100%] rounded-full border-t border-b border-blue-500/10 rotate-90" />

                {/* Orbiting Satellite (위성) */}
                <motion.div
                  className="absolute w-full h-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,1)]" />
                </motion.div>
              </motion.div>

              {/* Static Core Glow */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl" />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Globe size={14} /> Global Bio Network
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Connected Intelligence. <br />
              <span className="text-blue-500">Worldwide.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Dolbom의 AI 파이프라인은 로컬에 머물지 않습니다.<br />
              전 세계의 유전체 데이터와 실시간으로 연결되어,<br />
              가장 방대한 생체 데이터 댐을 구축하고 있습니다.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-zinc-500 uppercase">Real-time Analysis</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">Global</div>
                <div className="text-xs text-zinc-500 uppercase">Standard Data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. Bento Grid Features
      ========================================= */}
      <section className="py-32 px-4 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Technology</h2>
          <p className="text-zinc-400 text-lg">Dolbom이 구축한 3단계 딥테크 아키텍처입니다.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Server className="text-blue-400" />}
            title="Cloud-Native Pipeline"
            desc="AWS Batch & Nextflow 기반. 수만 마리의 유전체 데이터를 동시 처리하는 페타바이트급 인프라."
            tags={['AWS Batch', 'Nextflow', 'Docker']}
            delay={0.1}
          />
          <FeatureCard
            icon={<Dna className="text-purple-400" />}
            title="AI Imputation"
            desc="Beagle 5.4 기반 유전체 복원 기술. 저심도(Low-pass) 데이터의 결측치를 99.9% 정확도로 채웁니다."
            tags={['Beagle 5.4', 'Deep Tech', 'Cost-Down']}
            delay={0.2}
          />
          <FeatureCard
            icon={<Activity className="text-emerald-400" />}
            title="Dynamic Risk Scoring"
            desc="한국신용정보원 통계와 라이프로그(Lifelog)를 결합한 멀티모달 위험도 예측 엔진."
            tags={['Python', 'Multi-modal', 'Real-time']}
            delay={0.3}
          />
        </div>
      </section>

      {/* =========================================
          4. Stats Section
      ========================================= */}
      <section className="border-y border-white/5 bg-zinc-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="120K+" label="CIS Health Data" />
          <StatItem value="330+" label="Genetic Diseases" />
          <StatItem value="99.9%" label="Imputation Accuracy" />
          <StatItem value="v1.0" label="Engine Version" />
        </div>
      </section>

    </main>
  );
}

// --- Components ---

function CircuitDot({ path, duration, delay }: { path: { x: string, y: string }[], duration: number, delay: number }) {
  const xTimes = path.map(p => p.x);
  const yTimes = path.map(p => p.y);

  return (
    <motion.div
      initial={{ left: path[0].x, top: path[0].y, opacity: 0 }}
      animate={{
        left: xTimes,
        top: yTimes,
        opacity: [0, 1, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
        times: path.map((_, i) => i / (path.length - 1))
      }}
      className="absolute w-1.5 h-1.5 z-0"
    >
      <div className="w-full h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
      <div className="absolute -inset-2 bg-white/30 rounded-full blur-md" />
    </motion.div>
  );
}

function StreamCard({ item }: any) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-md min-w-[200px] shadow-lg">
      <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
        {item.icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-zinc-100 leading-none mb-1">{item.label}</span>
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">{item.sub}</span>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, tags, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
    >
      <div className="mb-6 p-3 bg-zinc-950 rounded-lg inline-block border border-white/10 group-hover:border-emerald-500/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-zinc-400 mb-6 leading-relaxed text-sm h-16">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 text-xs font-medium text-zinc-500 bg-zinc-950 border border-white/10 rounded group-hover:border-emerald-500/20 group-hover:text-emerald-500/70 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function StatItem({ value, label }: any) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
      <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  )
}