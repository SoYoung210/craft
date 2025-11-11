import React, { CSSProperties, useRef } from 'react';

interface ChromaticAberrationProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  offsetX?: number;
  offsetY?: number;
  className?: string;
  enableNoise?: boolean;
  enableGlitch?: boolean;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  intensity = 'medium',
  offsetX,
  offsetY,
  className = '',
  enableNoise = true,
  enableGlitch = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Get offset values based on intensity
  const getOffset = () => {
    if (offsetX !== undefined && offsetY !== undefined) {
      return { x: offsetX, y: offsetY };
    }

    switch (intensity) {
      case 'low':
        return { x: 2, y: 0 };
      case 'high':
        return { x: 8, y: 0 };
      case 'medium':
      default:
        return { x: 4, y: 0 };
    }
  };

  const offset = getOffset();

  const redLayerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    mixBlendMode: 'screen',
    filter: 'brightness(1) contrast(1)',
    transform: `translate(${-offset.x}px, ${offset.y}px)`,
    color: 'inherit',
    animation: enableGlitch ? 'glitch-red 0.3s infinite' : 'none',
  };

  const greenLayerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    mixBlendMode: 'screen',
    filter: 'brightness(1) contrast(1)',
    transform: 'translate(0, 0)',
    color: 'inherit',
    animation: enableGlitch ? 'glitch-green 0.4s infinite' : 'none',
  };

  const blueLayerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    mixBlendMode: 'screen',
    filter: 'brightness(1) contrast(1)',
    transform: `translate(${offset.x}px, ${-offset.y}px)`,
    color: 'inherit',
    animation: enableGlitch ? 'glitch-blue 0.35s infinite' : 'none',
  };

  const noiseStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15,
    pointerEvents: 'none' as const,
    mixBlendMode: 'overlay' as const,
    zIndex: 10,
  };

  return (
    <>
      <style>
        {`
          .chromatic-aberration-layer {
            pointer-events: none;
          }

          .chromatic-aberration-red {
            color: red;
            -webkit-text-fill-color: red;
          }

          .chromatic-aberration-green {
            color: lime;
            -webkit-text-fill-color: lime;
          }

          .chromatic-aberration-blue {
            color: blue;
            -webkit-text-fill-color: blue;
          }

          /* Ensure child elements inherit the color channel */
          .chromatic-aberration-red * {
            color: inherit !important;
            background-color: transparent !important;
          }

          .chromatic-aberration-green * {
            color: inherit !important;
            background-color: transparent !important;
          }

          .chromatic-aberration-blue * {
            color: inherit !important;
            background-color: transparent !important;
          }

          /* Glitch animations */
          @keyframes glitch-red {
            0%, 100% {
              transform: translate(${-offset.x}px, ${offset.y}px);
              opacity: 1;
            }
            10% {
              transform: translate(${-offset.x - 2}px, ${offset.y + 1}px);
              opacity: 0.8;
            }
            20% {
              transform: translate(${-offset.x + 1}px, ${offset.y - 1}px);
              opacity: 1;
            }
            30% {
              transform: translate(${-offset.x}px, ${offset.y}px);
              opacity: 0.9;
            }
            50% {
              transform: translate(${-offset.x - 1}px, ${offset.y + 2}px);
              opacity: 1;
            }
            70% {
              transform: translate(${-offset.x + 2}px, ${offset.y}px);
              opacity: 0.85;
            }
          }

          @keyframes glitch-green {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 1;
            }
            15% {
              transform: translate(1px, -1px);
              opacity: 0.9;
            }
            25% {
              transform: translate(-1px, 1px);
              opacity: 1;
            }
            45% {
              transform: translate(0, 0);
              opacity: 0.95;
            }
            65% {
              transform: translate(1px, 0);
              opacity: 1;
            }
            85% {
              transform: translate(-1px, -1px);
              opacity: 0.9;
            }
          }

          @keyframes glitch-blue {
            0%, 100% {
              transform: translate(${offset.x}px, ${-offset.y}px);
              opacity: 1;
            }
            12% {
              transform: translate(${offset.x + 2}px, ${-offset.y - 1}px);
              opacity: 0.85;
            }
            24% {
              transform: translate(${offset.x - 1}px, ${-offset.y + 1}px);
              opacity: 1;
            }
            36% {
              transform: translate(${offset.x}px, ${-offset.y}px);
              opacity: 0.9;
            }
            60% {
              transform: translate(${offset.x + 1}px, ${-offset.y - 2}px);
              opacity: 1;
            }
            80% {
              transform: translate(${offset.x - 2}px, ${-offset.y}px);
              opacity: 0.8;
            }
          }

          /* Noise animation */
          @keyframes noise {
            0%, 100% { 
              transform: translate(0, 0); 
            }
            10% { 
              transform: translate(-5%, -10%); 
            }
            20% { 
              transform: translate(-15%, 5%); 
            }
            30% { 
              transform: translate(7%, -25%); 
            }
            40% { 
              transform: translate(-5%, 25%); 
            }
            50% { 
              transform: translate(-15%, 10%); 
            }
            60% { 
              transform: translate(15%, 0%); 
            }
            70% { 
              transform: translate(0%, 15%); 
            }
            80% { 
              transform: translate(3%, -10%); 
            }
            90% { 
              transform: translate(-10%, 5%); 
            }
          }

          .chromatic-noise {
            animation: noise 0.2s infinite;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }
        `}
      </style>
      <div
        ref={containerRef}
        className={`chromatic-aberration-container ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        {/* Red channel - shifted left */}
        <div
          style={redLayerStyle}
          className="chromatic-aberration-layer chromatic-aberration-red"
        >
          {children}
        </div>

        {/* Green channel - centered */}
        <div
          style={greenLayerStyle}
          className="chromatic-aberration-layer chromatic-aberration-green"
        >
          {children}
        </div>

        {/* Blue channel - shifted right */}
        <div
          style={blueLayerStyle}
          className="chromatic-aberration-layer chromatic-aberration-blue"
        >
          {children}
        </div>

        {/* Noise overlay */}
        {enableNoise && <div style={noiseStyle} className="chromatic-noise" />}
      </div>
    </>
  );
};

export default ChromaticAberration;
