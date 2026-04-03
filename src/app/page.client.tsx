'use client';

import { CraftGrid } from '../components/craft-grid/CraftGrid';

function SocialLinks({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 text-[10px] font-mono tracking-widest text-black/40 uppercase${className ? ` ${className}` : ''}`}
    >
      <a
        href="https://x.com/soyoung__ee"
        target="_blank"
        rel="noopener noreferrer"
        className="touch-target transition-colors hover:text-black/60"
      >
        X
      </a>
      <a
        href="https://github.com/soyoung210"
        target="_blank"
        rel="noopener noreferrer"
        className="touch-target transition-colors hover:text-black/60"
      >
        Github
      </a>
      <a
        href="mailto:me@so-so.dev"
        className="touch-target transition-colors hover:text-black/60"
      >
        Email
      </a>
    </div>
  );
}

export default function IndexClient() {
  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-screen overflow-hidden bg-white text-black">
      {/* Header / Sidebar Area */}
      <div className="relative z-20 flex w-full lg:w-[320px] shrink-0 flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/5 bg-[#FFF] p-6 lg:p-8 overflow-hidden">
        {/* Animated Aurora Gradient */}
        <div
          className="pointer-events-none absolute -top-[50%] lg:-top-[25%] left-1/2 -z-10 h-[200%] w-[200%] lg:h-[150%] lg:w-[150%] animate-[background-rotate_20s_linear_infinite] opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 20%, rgba(131, 58, 180, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(253, 29, 29, 0.6) 0%, transparent 50%),
              radial-gradient(circle at 20% 50%, rgba(32, 226, 215, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 50% 80%, rgba(252, 176, 69, 0.6) 0%, transparent 50%)
            `,
            filter: 'blur(80px) saturate(100%)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-2 lg:block">
          <div className="flex items-end justify-between lg:block">
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tighter">
              Craft
            </h1>
            <div className="lg:hidden text-[10px] font-mono tracking-widest text-black/30 uppercase">
              © 2026 SOYOUNG
            </div>
          </div>
          <p className="lg:mt-6 text-sm leading-relaxed text-black/50">
            A collection of interfaces, visual interactions, and frontend
            experiments.
          </p>
          <SocialLinks className="lg:hidden" />
        </div>
        <div className="hidden lg:flex relative z-10 flex-col gap-3">
          <SocialLinks />
          <div className="text-[10px] font-mono tracking-widest text-black/30 uppercase">
            © 2026 SOYOUNG
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="relative flex-1 overflow-hidden bg-[#FEFEFD]">
        <CraftGrid />
      </div>
    </div>
  );
}
