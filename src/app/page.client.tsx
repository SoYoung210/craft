'use client';

import { CraftGrid } from '../components/craft-grid/CraftGrid';

export default function IndexClient() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-black">
      {/* Sidebar Area */}
      <div className="flex w-[320px] shrink-0 flex-col justify-between border-r border-black/5 bg-[#FFF] p-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter">Craft</h1>
          <p className="mt-6 text-sm leading-relaxed text-black/50">
            A collection of interfaces, visual interactions, and frontend
            experiments.
          </p>
        </div>
        <div className="text-[10px] font-mono tracking-widest text-black/30 uppercase">
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
