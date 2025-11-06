import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

interface PixelRippleCanvasProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode | null;
  gridSize?: number;
  pixelColor?: string;
  animationDuration?: number;
  className?: string;
  style?: CSSProperties;
  density?: number;
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  distance: number;
  band: number;
  random: number;
}

export const PixelRippleCanvas: React.FC<PixelRippleCanvasProps> = ({
  firstContent,
  secondContent,
  gridSize = 10,
  pixelColor = '#0066FF',
  animationDuration = 300, // in milliseconds
  className = '',
  style = {},
  density = 100,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const mouseEntryPointRef = useRef<{ x: number; y: number } | null>(null);
  const animationStartTimeRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const animationDirectionRef = useRef<'forward' | 'reverse'>('forward');

  const [isActive, setIsActive] = useState<boolean>(false);

  // Initialize pixels based on container dimensions
  const initializePixels = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false;
    }

    // Calculate pixel size based on larger dimension
    const largerDimension = Math.max(width, height);
    const pixelSize = largerDimension / gridSize;

    // Calculate grid dimensions
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    // Create pixels with 1px overlap to prevent gaps
    const pixels: Pixel[] = [];
    const threshold = density / 100;
    const overlap = 1; // 1px overlap to prevent gaps

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Use density to determine if we should create this pixel
        if (Math.random() < threshold) {
          pixels.push({
            x: col * pixelSize,
            y: row * pixelSize,
            size: pixelSize + overlap, // Add 1px overlap
            opacity: 0,
            targetOpacity: 0,
            distance: 0, // Will be calculated based on mouse position
            band: 0, // Will be calculated based on distance
            random: Math.random(), // Random value for variation in animation
          });
        }
      }
    }

    pixelsRef.current = pixels;
  }, [gridSize, density]);

  // Calculate distance and bands for pixels based on mouse entry point
  const calculatePixelDistances = useCallback(
    (mouseX: number, mouseY: number) => {
      const pixels = pixelsRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = parseInt(canvas.style.width || '0');
      const height = parseInt(canvas.style.height || '0');

      // Normalize mouse position
      const normalizedX = mouseX / width;
      const normalizedY = mouseY / height;

      // Update pixel distances
      pixels.forEach(pixel => {
        const pixelCenterX = (pixel.x + pixel.size / 2) / width;
        const pixelCenterY = (pixel.y + pixel.size / 2) / height;

        const dx = pixelCenterX - normalizedX;
        const dy = pixelCenterY - normalizedY;
        pixel.distance = Math.sqrt(dx * dx + dy * dy);

        // Assign to bands (0-7)
        const maxDistance = Math.sqrt(2);
        const numBands = 8;
        pixel.band = Math.min(
          Math.floor((pixel.distance / maxDistance) * numBands),
          numBands - 1
        );
      });

      // Sort pixels by distance for animation
      pixels.sort((a, b) => a.distance - b.distance);
    },
    []
  );

  // Draw pixels on canvas
  const drawPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = parseInt(canvas.style.width || '0');
    const height = parseInt(canvas.style.height || '0');

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set pixel color
    ctx.fillStyle = pixelColor;

    // Draw each pixel
    pixelsRef.current.forEach(pixel => {
      if (pixel.opacity > 0.01) {
        ctx.globalAlpha = pixel.opacity;
        ctx.fillRect(
          Math.floor(pixel.x),
          Math.floor(pixel.y),
          Math.ceil(pixel.size),
          Math.ceil(pixel.size)
        );
      }
    });

    ctx.globalAlpha = 1;
  }, [pixelColor]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isAnimatingRef.current) return;

    const startTime = animationStartTimeRef.current;
    if (!startTime) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    const pixels = pixelsRef.current;
    const numBands = 8;
    const waveWidth = 2; // Number of visible bands at once

    if (animationDirectionRef.current === 'forward') {
      // Animate from center to edges with randomness
      pixels.forEach(pixel => {
        const bandProgress = progress * (numBands + waveWidth) - pixel.band;

        // Add random offset to make bands less obvious (-0.5 to +0.5 band range)
        const randomOffset = (pixel.random - 0.5) * 1.5;
        const adjustedProgress = bandProgress + randomOffset;

        if (adjustedProgress >= 0 && adjustedProgress < waveWidth) {
          // Pixel is in the wave - add random variation to appearance
          // Some pixels appear, some don't (60-40 split)
          if (pixel.random > 0.4) {
            pixel.opacity = 1;
          } else {
            pixel.opacity = 0;
          }
        } else if (adjustedProgress >= waveWidth) {
          // Wave has passed
          pixel.opacity = 0;
        } else {
          // Wave hasn't reached yet
          pixel.opacity = 0;
        }
      });
    } else {
      // Animate from edges to center (reverse) with randomness
      pixels.forEach(pixel => {
        const reverseBand = numBands - 1 - pixel.band;
        const bandProgress = progress * (numBands + waveWidth) - reverseBand;

        // Add random offset to make bands less obvious
        const randomOffset = (pixel.random - 0.5) * 1.5;
        const adjustedProgress = bandProgress + randomOffset;

        if (adjustedProgress >= 0 && adjustedProgress < waveWidth) {
          // Pixel is in the wave - add random variation to appearance
          if (pixel.random > 0.4) {
            pixel.opacity = 1;
          } else {
            pixel.opacity = 0;
          }
        } else if (adjustedProgress >= waveWidth) {
          // Wave has passed
          pixel.opacity = 0;
        } else {
          // Wave hasn't reached yet
          pixel.opacity = 0;
        }
      });
    }

    drawPixels();

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      isAnimatingRef.current = false;
      animationRef.current = null;

      // Clear all pixels
      pixels.forEach(pixel => {
        pixel.opacity = 0;
      });
      drawPixels();

      // Show/hide second content
      const activeEl = activeRef.current;
      if (activeEl) {
        if (animationDirectionRef.current === 'forward') {
          activeEl.style.display = 'block';
          activeEl.style.pointerEvents = 'none';
        } else {
          activeEl.style.display = 'none';
          activeEl.style.pointerEvents = '';
        }
      }
    }
  }, [animationDuration, drawPixels]);

  // Start animation
  const startAnimation = useCallback(
    (direction: 'forward' | 'reverse') => {
      if (isAnimatingRef.current) {
        // Cancel current animation
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

  // Handle mouse enter
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || isActive) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseEntryPointRef.current = { x: mouseX, y: mouseY };
      calculatePixelDistances(mouseX, mouseY);

      setIsActive(true);
      startAnimation('forward');
    },
    [isActive, calculatePixelDistances, startAnimation]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (!isActive) return;

    setIsActive(false);
    startAnimation('reverse');
  }, [isActive, startAnimation]);

  // Handle click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!isActive) {
        mouseEntryPointRef.current = { x: mouseX, y: mouseY };
        calculatePixelDistances(mouseX, mouseY);
      }

      setIsActive(!isActive);
      startAnimation(isActive ? 'reverse' : 'forward');
    },
    [isActive, calculatePixelDistances, startAnimation]
  );

  // Initialize on mount and handle resize
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
      <div
        className="pixel-ripple__active absolute inset-0 w-full h-full"
        ref={activeRef}
        style={{ display: 'none' }}
      >
        {secondContent}
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[3] pointer-events-none"
        style={{ display: 'block' }}
      />
    </div>
  );
};