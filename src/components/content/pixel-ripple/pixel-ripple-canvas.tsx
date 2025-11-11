import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { HoverEffectType, CHROMATIC_CONFIG, FUZZY_CONFIG } from './constants';
import { ChromaticAberration } from './ChromaticAberration';
import { FuzzyText } from './FuzzyText';
import { Pixel } from './types';
import {
  createPixelGrid,
  calculatePixelDistances,
  updatePixelsForward,
  updatePixelsReverse,
  clearPixels,
} from './pixel-utils';
import { setupCanvas, drawPixels } from './canvas-utils';
import {
  createScanlineStyles,
  createMovingScanlineStyles,
  createFlickerStyles,
  createChromaticOverlayStyles,
  getContentFilter,
} from './styles';

interface PixelRippleCanvasProps {
  children: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationDuration?: number;
  className?: string;
  style?: CSSProperties;
  density?: number;
  enableScanlines?: boolean;
  scanlineColor?: 'green' | 'amber' | 'white' | 'none';
  hoverEffect?: HoverEffectType;
  chromaticIntensity?: 'low' | 'medium' | 'high';
  chromaticNoise?: boolean;
  chromaticGlitch?: boolean;
}

const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (React.isValidElement(children)) {
    return extractTextFromChildren(children.props.children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  return '';
};

export const PixelRippleCanvas = ({
  children,
  gridSize = 10,
  pixelColor = '#0066FF',
  animationDuration = 300, // in milliseconds
  className = '',
  style = {},
  density = 100,
  enableScanlines = false,
  scanlineColor = 'green',
  hoverEffect = 'scanlines',
  chromaticIntensity = 'medium',
  chromaticNoise = true,
  chromaticGlitch = true,
}: PixelRippleCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const mouseEntryPointRef = useRef<{ x: number; y: number } | null>(null);
  const animationStartTimeRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const animationDirectionRef = useRef<'forward' | 'reverse'>('forward');

  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showChromatic, setShowChromatic] = useState(false);
  const chromaticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isFuzzyActive = hoverEffect === 'fuzzy' && isHovered;

  const initializePixels = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    setupCanvas(canvas, width, height);

    const pixels = createPixelGrid(width, height, gridSize, density);
    pixelsRef.current = pixels;
  }, [gridSize, density]);

  const calculateDistances = useCallback((mouseX: number, mouseY: number) => {
    const pixels = pixelsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = parseInt(canvas.style.width || '0');
    const height = parseInt(canvas.style.height || '0');

    calculatePixelDistances(pixels, mouseX, mouseY, width, height);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawPixels(canvas, pixelsRef.current, pixelColor);
  }, [pixelColor]);

  const animate = useCallback(() => {
    if (!isAnimatingRef.current) return;

    const startTime = animationStartTimeRef.current;
    if (!startTime) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    const pixels = pixelsRef.current;

    if (animationDirectionRef.current === 'forward') {
      updatePixelsForward(pixels, progress);
    } else {
      updatePixelsReverse(pixels, progress);
    }

    draw();

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      isAnimatingRef.current = false;
      animationRef.current = null;

      clearPixels(pixels);
      draw();
    }
  }, [animationDuration, draw]);

  const startAnimation = useCallback(
    (direction: 'forward' | 'reverse') => {
      if (isAnimatingRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }

      animationDirectionRef.current = direction;
      isAnimatingRef.current = true;
      animationStartTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  const triggerChromaticEffect = useCallback((): void => {
    setShowChromatic(true);

    chromaticTimeoutRef.current = setTimeout(() => {
      setShowChromatic(false);
    }, CHROMATIC_CONFIG.duration);
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);

      if (hoverEffect === 'chromaticAberration') {
        triggerChromaticEffect();
      }

      const container = containerRef.current;
      if (!container || isActive) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseEntryPointRef.current = { x: mouseX, y: mouseY };
      calculateDistances(mouseX, mouseY);

      setIsActive(true);
      startAnimation('forward');
    },
    [
      isActive,
      calculateDistances,
      startAnimation,
      hoverEffect,
      triggerChromaticEffect,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    if (hoverEffect === 'chromaticAberration') {
      if (chromaticTimeoutRef.current) {
        clearTimeout(chromaticTimeoutRef.current);
      }
      setShowChromatic(false);
    }

    if (!isActive) return;

    setIsActive(false);
    startAnimation('reverse');
  }, [isActive, startAnimation, hoverEffect]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!isActive) {
        mouseEntryPointRef.current = { x: mouseX, y: mouseY };
        calculateDistances(mouseX, mouseY);
      }

      setIsActive(!isActive);
      startAnimation(isActive ? 'reverse' : 'forward');
    },
    [isActive, calculateDistances, startAnimation]
  );

  useEffect(() => {
    initializePixels();

    const handleResize = () => {
      initializePixels();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializePixels]);

  const scanlineStyles = createScanlineStyles(
    isHovered,
    hoverEffect,
    scanlineColor
  );
  const movingScanlineStyles = createMovingScanlineStyles(
    isHovered,
    hoverEffect,
    scanlineColor
  );
  const flickerStyles = createFlickerStyles(isHovered, hoverEffect);
  const chromaticOverlayStyles = createChromaticOverlayStyles(showChromatic);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap');

          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(calc(100vh + 100%)); }
          }

          @keyframes flicker {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.02; }
          }

          .pixel-ripple__content {
            filter: ${getContentFilter(
              isHovered,
              hoverEffect,
              enableScanlines,
              scanlineColor
            )};
            transition: filter 0.3s ease-in-out, font-family 0.3s ease-in-out;
          }

          @keyframes chromatic-fade {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }

          .pixel-ripple__chromatic {
            animation: chromatic-fade ${
              CHROMATIC_CONFIG.duration
            }ms ease-in-out;
          }

          .pixel-ripple__fuzzy canvas {
            background: transparent !important;
          }
        `}
      </style>
      <div
        ref={containerRef}
        className={`pixel-ripple relative overflow-hidden ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className="pixel-ripple__content"
          style={{
            color: isFuzzyActive ? '#000' : '#fff',
          }}
        >
          {children}
        </div>

        {/* Chromatic Aberration Overlay */}
        {hoverEffect === 'chromaticAberration' && showChromatic && (
          <div
            style={chromaticOverlayStyles}
            className="pixel-ripple__chromatic"
          >
            <ChromaticAberration
              intensity={chromaticIntensity}
              enableNoise={chromaticNoise}
              enableGlitch={chromaticGlitch}
            >
              {children}
            </ChromaticAberration>
          </div>
        )}

        {/* Fuzzy Text Overlay (hoverEffect === 'fuzzy' && showFuzzy) */}
        {isFuzzyActive && (
          <div className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none pixel-ripple__fuzzy">
            <div style={{ display: 'inline-block' }}>
              <FuzzyText
                fontSize="48px"
                fontWeight={900}
                intensity={FUZZY_CONFIG.baseIntensity}
                color="#fff"
              >
                {extractTextFromChildren(children)}
              </FuzzyText>
            </div>
          </div>
        )}

        {/* Scanline Effects */}
        {hoverEffect === 'scanlines' && enableScanlines && (
          <>
            {/* Static scanlines */}
            <div style={scanlineStyles} />

            {/* Moving scanline */}
            <div style={movingScanlineStyles} />

            {/* Flicker effect */}
            <div style={flickerStyles} />
          </>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-[3] pointer-events-none"
          style={{ display: 'block' }}
        />
      </div>
    </>
  );
};
