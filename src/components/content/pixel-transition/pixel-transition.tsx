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
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(
      '.pixelated-image-card__pixel'
    );
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    // gsap.set(pixels, { display: "none" })
    gsap.set(pixels, { opacity: 0 });

    const allPixels = Array.from(pixels);
    const densityDecimal = Math.max(0, Math.min(100, density)) / 100; // Clamp between 0-100 and convert to decimal
    const pixelCount = Math.ceil(allPixels.length * densityDecimal);

    // Shuffle and pick random pixels
    const shuffled = allPixels.sort(() => Math.random() - 0.5);
    const selectedPixels = shuffled.slice(0, pixelCount);

    // Create random animation order by assigning random delays
    const pixelsWithRandomDelay = selectedPixels.map(pixel => ({
      pixel,
      delay: Math.random(),
    }));

    // Sort by random delay
    pixelsWithRandomDelay.sort((a, b) => a.delay - b.delay);

    const staggerDuration = animationStepDuration / selectedPixels.length;

    // Animate in random order (using sorted array)
    pixelsWithRandomDelay.forEach((item, index) => {
      gsap.to(item.pixel, {
        // display: "block",
        opacity: 1,
        duration: 0,
        delay: index * staggerDuration,
      });
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
      activeEl.style.pointerEvents = activate ? 'none' : '';
    });

    // Animate out in random order (shuffle again for different pattern)
    const shuffledOut = [...pixelsWithRandomDelay].sort(
      () => Math.random() - 0.5
    );
    shuffledOut.forEach((item, index) => {
      gsap.to(item.pixel, {
        // display: "none",
        opacity: 0,
        duration: 0,
        delay: animationStepDuration + index * staggerDuration,
      });
    });
  };

  const handleMouseEnter = (): void => {
    if (!isActive) animatePixels(true);
  };
  const handleMouseLeave = (): void => {
    if (isActive) animatePixels(false);
  };
  const handleClick = (): void => {
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
