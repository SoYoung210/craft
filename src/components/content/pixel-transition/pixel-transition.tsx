import { gsap } from 'gsap';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

// import './PixelTransition.css';

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode | null;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
  density?: number;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  className = '',
  style = {},
  density = 100,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const mouseEntryPointRef = useRef<{ x: number; y: number } | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;

        // pixel.style.position = "absolute"
        pixel.style.width = `${size}%`;
        pixel.style.opacity = '0';
        pixel.style.aspectRatio = '1/1';
        // pixel.style.height = `${size}%`
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    const containerEl = containerRef.current;
    if (!pixelGridEl || !activeEl || !containerEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(
      '.pixelated-image-card__pixel'
    );
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { opacity: 0 });

    const allPixels = Array.from(pixels);
    const densityDecimal = Math.max(0, Math.min(100, density)) / 100;
    const pixelCount = Math.ceil(allPixels.length * densityDecimal);

    // Calculate distance from mouse entry point for ALL pixels first
    const entryPoint = mouseEntryPointRef.current || { x: 0.5, y: 0.5 };

    const allPixelsWithDistance = allPixels.map((pixel, index) => {
      const col = index % gridSize;
      const row = Math.floor(index / gridSize);

      // Calculate pixel center position (normalized 0-1)
      const pixelCenterX = (col + 0.5) / gridSize;
      const pixelCenterY = (row + 0.5) / gridSize;

      // Calculate distance from entry point
      const dx = pixelCenterX - entryPoint.x;
      const dy = pixelCenterY - entryPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return {
        pixel,
        distance,
        random: Math.random(), // Add random factor for variation
      };
    });

    // Group pixels into distance bands (rings)
    const maxDistance = Math.sqrt(2); // Maximum possible distance in normalized space
    const numBands = 8; // Number of distance bands
    const bandSize = maxDistance / numBands;

    const pixelBands: (typeof allPixelsWithDistance)[] = Array(numBands)
      .fill(null)
      .map(() => []);

    allPixelsWithDistance.forEach(pixelData => {
      const bandIndex = Math.min(
        Math.floor(pixelData.distance / bandSize),
        numBands - 1
      );
      pixelBands[bandIndex].push(pixelData);
    });

    // Randomly select pixels from each band based on density
    const selectedPixels: typeof allPixelsWithDistance = [];
    const pixelsPerBand = Math.ceil(pixelCount / numBands);

    pixelBands.forEach(band => {
      // Shuffle pixels within each band
      const shuffledBand = [...band].sort((a, b) => a.random - b.random);
      // Take a portion based on density
      const takeCount = Math.min(pixelsPerBand, shuffledBand.length);
      selectedPixels.push(...shuffledBand.slice(0, takeCount));
    });

    // Trim to exact pixel count if we have too many
    selectedPixels.splice(pixelCount);

    // Create animation sequence with some randomness within each distance group
    const animationSequence: typeof allPixelsWithDistance = [];

    // For enter animation: animate from center outward with randomness
    pixelBands.forEach((band, bandIndex) => {
      const bandPixels = selectedPixels.filter(p => {
        const pBandIndex = Math.min(
          Math.floor(p.distance / bandSize),
          numBands - 1
        );
        return pBandIndex === bandIndex;
      });

      // Add random variation within each band
      const shuffledBandPixels = [...bandPixels].sort(
        () => Math.random() - 0.5
      );
      animationSequence.push(...shuffledBandPixels);
    });

    // Create wave animation - pixels appear and disappear to create moving effect
    const waveWidth = 2; // How many bands are visible at once
    const totalWaveDuration = animationStepDuration;
    const waveDuration = totalWaveDuration / (numBands + waveWidth);

    if (activate) {
      // ENTER: Wave moves from center to edges only

      pixelBands.forEach((band, bandIndex) => {
        const bandPixels = selectedPixels.filter(p => {
          const pBandIndex = Math.min(
            Math.floor(p.distance / bandSize),
            numBands - 1
          );
          return pBandIndex === bandIndex;
        });

        // Shuffle pixels within the band for randomness
        const shuffledBandPixels = [...bandPixels].sort(
          () => Math.random() - 0.5
        );

        shuffledBandPixels.forEach(item => {
          const startDelay = bandIndex * waveDuration;
          const randomOffset = Math.random() * waveDuration * 0.2; // 20% random variation

          // Fade in
          gsap.to(item.pixel, {
            opacity: 1,
            duration: 0,
            delay: startDelay + randomOffset,
          });

          // Fade out after wave passes - ALL bands fade out
          gsap.to(item.pixel, {
            opacity: 0,
            duration: 0,
            delay: startDelay + randomOffset + waveWidth * waveDuration,
          });
        });
      });

      // Show second content after wave starts moving
      delayedCallRef.current = gsap.delayedCall(waveDuration * 2, () => {
        activeEl.style.display = 'block';
        activeEl.style.pointerEvents = 'none';
      });

      // Make absolutely sure all pixels are cleared after animation completes
      gsap.delayedCall(totalWaveDuration + waveWidth * waveDuration, () => {
        gsap.set(pixels, { opacity: 0 });
      });
    } else {
      // EXIT: Wave moves from edges back to center
      activeEl.style.display = 'none';
      activeEl.style.pointerEvents = '';

      // Animate wave returning from edges to center
      // We need to reverse the order - start from outer bands and move inward
      pixelBands.forEach((band, bandIndex) => {
        const reverseBandIndex = numBands - 1 - bandIndex; // Start from outer bands
        const bandPixels = selectedPixels.filter(p => {
          const pBandIndex = Math.min(
            Math.floor(p.distance / bandSize),
            numBands - 1
          );
          return pBandIndex === reverseBandIndex;
        });

        // Shuffle for different pattern on exit
        const shuffledBandPixels = [...bandPixels].sort(
          () => Math.random() - 0.5
        );

        shuffledBandPixels.forEach(item => {
          const startDelay = bandIndex * waveDuration;
          const randomOffset = Math.random() * waveDuration * 0.2;

          // Fade in the pixel as part of the returning wave
          gsap.to(item.pixel, {
            opacity: 1,
            duration: 0,
            delay: startDelay + randomOffset,
          });

          // Fade out after wave passes (except for the innermost band)
          if (reverseBandIndex > waveWidth - 1) {
            gsap.to(item.pixel, {
              opacity: 0,
              duration: 0,
              delay: startDelay + randomOffset + waveWidth * waveDuration,
            });
          }
        });
      });

      // Make sure all pixels disappear at the end
      delayedCallRef.current = gsap.delayedCall(
        totalWaveDuration + waveWidth * waveDuration,
        () => {
          // Clear all remaining pixels
          gsap.set(pixels, { opacity: 0 });
        }
      );
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const rect = containerEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Store the normalized entry point (0-1 range)
    mouseEntryPointRef.current = { x, y };

    if (!isActive) animatePixels(true);
  };

  const handleMouseLeave = (): void => {
    // Don't update the entry point on leave - keep the original entry point
    // so the animation returns to where it started
    if (isActive) animatePixels(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const rect = containerEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Only update entry point if we're activating
    if (!isActive) {
      mouseEntryPointRef.current = { x, y };
    }

    animatePixels(!isActive);
  };

  return (
    <div
      ref={containerRef}
      className={`pixelated-image-card relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* <div style={{ paddingTop: aspectRatio }} /> */}
      <div className="pixelated-image-card__default">{firstContent}</div>
      <div className="pixelated-image-card__active" ref={activeRef}>
        {secondContent}
      </div>
      <div
        className="pixelated-image-card__pixels w-full flex flex-wrap h-full z-[3] inset-0 absolute pointer-events-none"
        ref={pixelGridRef}
      />
    </div>
  );
};
