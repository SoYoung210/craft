import { gsap } from 'gsap';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface PixelRippleProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode | null;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
  density?: number;
}

export const PixelRipple: React.FC<PixelRippleProps> = ({
  firstContent,
  secondContent,
  gridSize = 10, // Use gridSize to determine number of pixels in the larger dimension
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
    const containerEl = containerRef.current;
    if (!pixelGridEl || !containerEl) return;

    pixelGridEl.innerHTML = '';

    // Get container dimensions
    const rect = containerEl.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Calculate pixel size based on the larger dimension
    // This ensures we have gridSize pixels along the larger dimension
    const largerDimension = Math.max(containerWidth, containerHeight);
    const calculatedPixelSize = largerDimension / gridSize;

    // Calculate how many pixels we need in each dimension
    const cols = Math.ceil(containerWidth / calculatedPixelSize);
    const rows = Math.ceil(containerHeight / calculatedPixelSize);

    // Generate pixels in a grid pattern
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Use density to determine if we should create this pixel
        const threshold = density / 100;

        // Create pixels based on density with some randomness
        if (Math.random() < threshold) {
          const pixel = document.createElement('div');
          pixel.classList.add('pixel-ripple__pixel');
          pixel.style.backgroundColor = pixelColor;
          pixel.style.position = 'absolute';
          // Add 1px overlap to prevent gaps between pixels (matching Canvas version)
          pixel.style.width = `${calculatedPixelSize + 1}px`;
          pixel.style.height = `${calculatedPixelSize + 1}px`;
          pixel.style.aspectRatio = '1/1'; // Ensure square aspect ratio
          pixel.style.opacity = '0';
          pixel.style.left = `${col * calculatedPixelSize}px`;
          pixel.style.top = `${row * calculatedPixelSize}px`;
          pixel.style.pointerEvents = 'none'; // Prevent interaction

          // Store position data for animation calculations
          pixel.dataset.col = col.toString();
          pixel.dataset.row = row.toString();
          pixel.dataset.cols = cols.toString();
          pixel.dataset.rows = rows.toString();

          pixelGridEl.appendChild(pixel);
        }
      }
    }
  }, [gridSize, pixelColor, density]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    const containerEl = containerRef.current;
    if (!pixelGridEl || !activeEl || !containerEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(
      '.pixel-ripple__pixel'
    );
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { opacity: 0 });

    const allPixels = Array.from(pixels);

    // Calculate distance from mouse entry point for ALL pixels
    const entryPoint = mouseEntryPointRef.current || { x: 0.5, y: 0.5 };

    const allPixelsWithDistance = allPixels.map(pixel => {
      // Get stored position data
      const col = parseFloat(pixel.dataset.col || '0');
      const row = parseFloat(pixel.dataset.row || '0');
      const cols = parseFloat(pixel.dataset.cols || '1');
      const rows = parseFloat(pixel.dataset.rows || '1');

      // Calculate pixel center position (normalized 0-1)
      const pixelCenterX = (col + 0.5) / cols;
      const pixelCenterY = (row + 0.5) / rows;

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

    // Since we already have optimized pixel count, use all pixels
    // Just shuffle within each band for randomness
    const selectedPixels: typeof allPixelsWithDistance = [];

    pixelBands.forEach(band => {
      // Shuffle pixels within each band for random appearance
      const shuffledBand = [...band].sort((a, b) => a.random - b.random);
      selectedPixels.push(...shuffledBand);
    });

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

          // Add random offset to make bands less obvious (-0.5 to +0.5 band range)
          // This creates more variation in when pixels appear within the wave
          const randomOffset = (item.random - 0.5) * waveDuration * 1.5;
          const adjustedDelay = Math.max(0, startDelay + randomOffset);

          // Only show 60% of pixels for more organic effect (matching Canvas version)
          if (item.random > 0.4) {
            // Fade in
            gsap.to(item.pixel, {
              opacity: 1,
              duration: 0,
              delay: adjustedDelay,
            });

            // Fade out after wave passes
            gsap.to(item.pixel, {
              opacity: 0,
              duration: 0,
              delay: adjustedDelay + waveWidth * waveDuration,
            });
          } else {
            // This pixel stays invisible during the wave
            gsap.set(item.pixel, {
              opacity: 0,
              delay: adjustedDelay,
            });
          }
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

          // Add random offset to make bands less obvious (matching Canvas version)
          const randomOffset = (item.random - 0.5) * waveDuration * 1.5;
          const adjustedDelay = Math.max(0, startDelay + randomOffset);

          // Only show 60% of pixels for more organic effect
          if (item.random > 0.4) {
            // Fade in the pixel as part of the returning wave
            gsap.to(item.pixel, {
              opacity: 1,
              duration: 0,
              delay: adjustedDelay,
            });

            // Fade out after wave passes (except for the innermost band)
            if (reverseBandIndex > waveWidth - 1) {
              gsap.to(item.pixel, {
                opacity: 0,
                duration: 0,
                delay: adjustedDelay + waveWidth * waveDuration,
              });
            }
          } else {
            // This pixel stays invisible during the wave
            gsap.set(item.pixel, {
              opacity: 0,
              delay: adjustedDelay,
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
      className={`pixel-ripple relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="pixel-ripple__default">{firstContent}</div>
      <div className="pixel-ripple__active" ref={activeRef}>
        {secondContent}
      </div>
      <div
        className="pixel-ripple__pixels w-full flex flex-wrap h-full z-[3] inset-0 absolute pointer-events-none"
        ref={pixelGridRef}
      />
    </div>
  );
};