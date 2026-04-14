'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

import { PhotoAspirationShader } from './photo-aspiration-shader';

interface OnboardingShaderBackgroundProps {
  imageUrl: string | null;
  children?: ReactNode;
}

export function OnboardingShaderBackground({
  imageUrl,
  children,
}: OnboardingShaderBackgroundProps) {
  if (!imageUrl) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        initial={{ filter: 'blur(12px)', opacity: 0.5, scale: 1.04 }}
        animate={{ filter: 'blur(0px)', opacity: 1.0, scale: 1.0 }}
        transition={{ duration: 2.5, ease: [0.17, 0.89, 0.3, 1] }}
      >
        <PhotoAspirationShader
          imageUrl={imageUrl}
          className="h-full w-full"
          targetProgress={0.35}
          duration={2.4}
          delay={0.3}
          darknessAmount={0.55}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-1"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.0, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('/noise.webp')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>

      {children}
    </>
  );
}
