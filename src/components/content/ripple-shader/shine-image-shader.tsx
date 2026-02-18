import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { animate } from 'motion/react';

interface ShineImageShaderProps {
  imageUrl: string;
  scale?: number;
  sharpness?: number;
  spread?: number;
  duration?: number;
  /** Delay before shine animation starts (in seconds) */
  delay?: number;
  className?: string;
  /** "cover" fills container (may crop), "contain" shows full image (may letterbox) */
  objectFit?: 'cover' | 'contain';
  /** Border radius in pixels */
  borderRadius?: number;
  onLoad?: (dimensions: { width: number; height: number }) => void;
  /** Overall glow brightness multiplier (default 1.0) */
  glowIntensity?: number;
  /** Hex color of the glow (default "#ffffff") */
  glowColor?: string;
  /** Hex background color for contain-mode letterbox area (default transparent) */
  backgroundColor?: string;
  /** Vertical alignment for cover mode (default "center") */
  objectPosition?: 'center' | 'top';
}

function hexToVec3(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1.0, 1.0, 1.0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float uProgress;
uniform float uScale;
uniform float uSharpness;
uniform float uImageAspect;
uniform sampler2D uTexture;

uniform float uObjectFit; // 0.0 = cover, 1.0 = contain
uniform float uObjectPosition; // vertical anchor: 0.5 = center, 1.0 = top
uniform float uBorderRadius; // in pixels
uniform float uGlowIntensity;
uniform vec3 uGlowColor;
uniform vec3 uBackgroundColor;
uniform float uHasBackground; // 1.0 = use background color, 0.0 = transparent

out vec4 fragColor;

// Signed distance function for rounded rectangle
float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// Get image bounds in UV space (for contain mode)
vec4 getImageBounds() {
  float canvasAspect = iResolution.x / iResolution.y;
  vec2 imageMin = vec2(0.0);
  vec2 imageMax = vec2(1.0);

  if (uObjectFit > 0.5) {
    if (canvasAspect > uImageAspect) {
      float imageWidth = uImageAspect / canvasAspect;
      imageMin.x = 0.5 - imageWidth / 2.0;
      imageMax.x = 0.5 + imageWidth / 2.0;
    } else {
      float imageHeight = canvasAspect / uImageAspect;
      imageMin.y = 0.5 - imageHeight / 2.0;
      imageMax.y = 0.5 + imageHeight / 2.0;
    }
  }
  return vec4(imageMin, imageMax);
}

// object-fit mapping from screen UV to texture UV
vec2 fitUV(vec2 screenUV) {
  float canvasAspect = iResolution.x / iResolution.y;
  vec2 result = screenUV;

  if (uObjectFit < 0.5) {
    if (canvasAspect > uImageAspect) {
      float ratio = uImageAspect / canvasAspect;
      result.y = (screenUV.y - uObjectPosition) * ratio + uObjectPosition;
    } else {
      result.x = (screenUV.x - 0.5) * (canvasAspect / uImageAspect) + 0.5;
    }
  } else {
    if (canvasAspect > uImageAspect) {
      result.x = (screenUV.x - 0.5) * (canvasAspect / uImageAspect) + 0.5;
    } else {
      result.y = (screenUV.y - 0.5) * (uImageAspect / canvasAspect) + 0.5;
    }
  }
  return result;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;
  vec2 textureUV = fitUV(uv);

  // Outside image bounds
  if (textureUV.x < 0.0 || textureUV.x > 1.0 || textureUV.y < 0.0 || textureUV.y > 1.0) {
    if (uHasBackground > 0.5) {
      fragColor = vec4(uBackgroundColor, 1.0);
    } else {
      fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    return;
  }

  // Rounded corners
  if (uBorderRadius > 0.0) {
    vec4 bounds = getImageBounds();
    vec2 imageCenter = (bounds.xy + bounds.zw) / 2.0;
    vec2 imageHalfSize = (bounds.zw - bounds.xy) / 2.0;
    float radiusUV = uBorderRadius / iResolution.y;
    float d = sdRoundedBox(uv - imageCenter, imageHalfSize, radiusUV);
    if (d > 0.0) {
      if (uHasBackground > 0.5) {
        fragColor = vec4(uBackgroundColor, 1.0);
      } else {
        fragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
      return;
    }
  }

  vec4 color = texture(uTexture, textureUV);

  // No effect during delay
  if (uProgress < 0.001) {
    fragColor = color;
    return;
  }

  // --- Wave: Bottom → Top (broad bloom) ---
  vec2 center2 = vec2(0.5, 1.05);
  float wp2 = smoothstep(0.25, 1.0, uProgress);
  float maxR2 = 1.6;
  float front2 = wp2 * maxR2;
  float safeFront2 = max(front2, 0.001);
  float dist2 = distance(uv, center2);

  float ramp2 = smoothstep(0.0, 0.3, wp2);

  float spread2 = 0.25;
  float scaleDiff2 = 0.0;
  vec2 disp2 = vec2(0.0);

  if (dist2 <= (safeFront2 + spread2) && dist2 >= max(safeFront2 - spread2, 0.0)) {
    float diff = dist2 - safeFront2;
    // Softer profile using smoothstep
    scaleDiff2 = smoothstep(spread2, 0.0, abs(diff));
    float diffTime = diff * scaleDiff2;
    vec2 dir = normalize(uv - center2);

    // Gentler displacement for wave 2
    disp2 = (dir * diffTime * ramp2) / (safeFront2 * max(dist2, 0.2) * 20.0);
    disp2 = clamp(disp2, -0.03, 0.03);
  }

  // Combined displacement
  vec2 totalDisp = disp2;
  vec2 displacedUV = clamp(uv + totalDisp, 0.0, 1.0);
  color = texture(uTexture, fitUV(displacedUV));

  // --- Luminous glow ---

  float glow2 = 0.0;
  if (scaleDiff2 > 0.0) {
    glow2 = scaleDiff2 * ramp2 / (safeFront2 * max(dist2, 0.2) * 8.0);
  }

  // Soft bloom extending beyond wave band (exponential falloff)
  float bloom2 = exp(-abs(dist2 - front2) * 4.0) * wp2 * 0.12;

  float totalGlow = (glow2 + bloom2) * uGlowIntensity;

  // Add glow as white/colored light (not just existing color multiplication)
  color.rgb += uGlowColor * totalGlow;

  fragColor = color;
}
`;

export function ShineImageShader({
  imageUrl,
  scale = 10.0,
  sharpness = 0.7,
  spread = 0.15,
  duration = 1.2,
  delay = 0,
  className = '',
  objectFit = 'cover',
  borderRadius,
  onLoad,
  glowIntensity = 1.0,
  glowColor = '#ffffff',
  backgroundColor,
  objectPosition = 'center',
}: ShineImageShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const hasAnimatedRef = useRef(false);
  const onLoadRef = useRef(onLoad);
  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    // Set clear color to transparent to prevent black flash
    renderer.gl.clearColor(0, 0, 0, 0);

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.background = 'transparent';

    const container = containerRef.current;
    container.appendChild(canvas);

    // Create transparent placeholder texture (prevents white flash before image loads)
    const placeholderTexture = new Texture(gl, {
      image: new Uint8Array([0, 0, 0, 0]),
      width: 1,
      height: 1,
      generateMipmaps: false,
    });

    const glowVec3 = hexToVec3(glowColor);
    const bgVec3 = backgroundColor ? hexToVec3(backgroundColor) : [0, 0, 0];

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        uProgress: { value: 0 },
        uScale: { value: scale },
        uSharpness: { value: sharpness },
        uTexture: { value: placeholderTexture },
        uImageAspect: { value: 1.0 },
        uObjectFit: { value: objectFit === 'contain' ? 1.0 : 0.0 },
        uObjectPosition: { value: objectPosition === 'top' ? 1.0 : 0.5 },
        uBorderRadius: { value: borderRadius ?? 0 },
        uGlowIntensity: { value: glowIntensity },
        uGlowColor: {
          value: new Float32Array(glowVec3),
        },
        uBackgroundColor: {
          value: new Float32Array(bgVec3),
        },
        uHasBackground: { value: backgroundColor ? 1.0 : 0.0 },
      },
    });

    programRef.current = program;
    hasAnimatedRef.current = false;
    const mesh = new Mesh(gl, { geometry, program });

    // Load the image as texture
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const texture = new Texture(gl, {
        image: img,
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        flipY: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (program.uniforms.uTexture as any).value = texture;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (program.uniforms.uImageAspect as any).value =
        img.naturalWidth / img.naturalHeight;
      setIsTextureLoaded(true);
      onLoadRef.current?.({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      // Start one-time ripple animation when texture loads
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        animate(0, 1, {
          duration,
          delay,
          ease: [0.4, 0.0, 0.2, 1],
          onUpdate: value => {
            if (programRef.current) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (programRef.current.uniforms.uProgress as any).value = value;
            }
          },
        });
      }
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    const loop = () => {
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      programRef.current = null;
      try {
        container.removeChild(canvas);
      } catch {
        // Ignore
      }
    };
  }, [
    imageUrl,
    scale,
    sharpness,
    spread,
    duration,
    delay,
    objectFit,
    objectPosition,
    borderRadius,
    glowIntensity,
    glowColor,
    backgroundColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`.trim()}
      style={{ opacity: isTextureLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
}
