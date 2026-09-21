'use client';

import { useState } from 'react';

import PhotoMosaic from '@/components/content/blur-reveal/PhotoMosaic';
import WelcomeInterstitial from '@/components/content/blur-reveal/WelcomeInterstitial';

export default function BlurRevealClient() {
  const [open, setOpen] = useState(true);
  const [run, setRun] = useState(0);

  function replay() {
    setRun(current => current + 1);
    setOpen(true);
  }

  return (
    <main className="min-h-dvh bg-[#fdf7ef]">
      <PhotoMosaic />
      {open ? (
        <WelcomeInterstitial key={run} onDismiss={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={replay}
          className="fixed bottom-6 left-1/2 z-40 h-11 -translate-x-1/2 rounded-full bg-[#222222] px-6 text-[15px] font-medium text-white shadow-lg transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] starting:opacity-0"
        >
          Replay
        </button>
      )}
    </main>
  );
}
