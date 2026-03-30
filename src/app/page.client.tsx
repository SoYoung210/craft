'use client';

import { CraftGrid } from '../components/craft-grid/CraftGrid';

export default function IndexClient() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-black">
      {/* Sidebar Area */}
      <div className="relative z-20 flex w-[320px] shrink-0 flex-col justify-between border-r border-black/5 bg-[#FFF] p-8 overflow-hidden">
        {/* Animated Aurora Gradient */}
        <div
          className="pointer-events-none absolute -top-[25%] left-1/2 -z-10 h-[150%] w-[150%] animate-[background-rotate_20s_linear_infinite] opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 20%, rgba(131, 58, 180, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(253, 29, 29, 0.6) 0%, transparent 50%),
              radial-gradient(circle at 20% 50%, rgba(32, 226, 215, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 50% 80%, rgba(252, 176, 69, 0.6) 0%, transparent 50%)
            `,
            filter: 'blur(60px) saturate(150%)',
          }}
        />

        <div className="relative z-10">
          <h1 className="text-4xl font-semibold tracking-tighter">Craft</h1>
          <p className="mt-6 text-sm leading-relaxed text-black/50">
            A collection of interfaces, visual interactions, and frontend
            experiments.
          </p>
        </div>
        <div className="relative z-10 text-[10px] font-mono tracking-widest text-black/30 uppercase">
          © 2026 SOYOUNG
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="relative flex-1 overflow-hidden bg-[#FEFEFD]">
        <CraftGrid />
      </div>
    </div>
  );
}
