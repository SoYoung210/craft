'use client';

export function CrtOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        style={{ mixBlendMode: 'overlay' }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      {/* Top and Bottom Fade (CRT Tube Screen Edge Effect) */}
      <div className="crt-vignette absolute inset-0" />
    </div>
  );
}
