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
  /** Chromatic aberration strength at the ripple edge (default 1.0, 0 = off) */
  chromaticAberration?: number;
  /** Iridescent color shift blend (default 1.0, 0 = flat glowColor only) */
  iridescence?: number;
  /** Caustic noise intensity in the ripple band (default 0.5, 0 = off) */
  causticIntensity?: number;
  /** Whether to auto-play the animation on mount (default true) */
  autoPlay?: boolean;
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
uniform float uChromaticAberration;
uniform float uIridescence;
uniform float uCausticIntensity;
uniform float uTime;

out vec4 fragColor;

// Simplex 2D noise
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289v3(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// NameDrop-style subtle iridescent tint blended with white
vec3 iridescentColor(vec2 uv, vec2 center, float dist, float front) {
  float angle = atan(uv.y - center.y, uv.x - center.x);
  float angleNorm = angle / (2.0 * 3.14159) + 0.5;
  float distPhase = (dist - front) * 2.0;
  float t = fract(angleNorm * 0.3 + distPhase);

  // Pastel palette: warm white → soft pink → cool white/blue
  vec3 warm = vec3(1.0, 0.95, 0.85);   // warm white with hint of gold
  vec3 pink = vec3(1.0, 0.82, 0.88);   // very soft pink
  vec3 cool = vec3(0.85, 0.92, 1.0);   // cool white with hint of blue

  vec3 col;
  if (t < 0.33) {
    col = mix(warm, pink, t / 0.33);
  } else if (t < 0.66) {
    col = mix(pink, cool, (t - 0.33) / 0.33);
  } else {
    col = mix(cool, warm, (t - 0.66) / 0.34);
  }
  return col;
}

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

  float fadeEnvelope = smoothstep(0.0, 0.15, uProgress) * smoothstep(1.0, 0.65, uProgress);
  if (uProgress < 0.001 || fadeEnvelope < 0.001) {
    fragColor = color;
    return;
  }

  // --- Shine ring: Top → Bottom ---
  vec2 center = vec2(0.5, 1.05);
  float wp = smoothstep(0.0, 1.0, uProgress);
  float maxR = 1.6;
  float front = wp * maxR;
  float safeFront = max(front, 0.001);
  float dist = distance(uv, center);

  float spread = 0.25;
  float scaleDiff = 0.0;
  vec2 disp = vec2(0.0);

  if (dist <= (safeFront + spread) && dist >= max(safeFront - spread, 0.0)) {
    float diff = dist - safeFront;
    scaleDiff = smoothstep(spread, 0.0, abs(diff));
    float diffTime = diff * scaleDiff;
    vec2 dir = normalize(uv - center);
    disp = dir * diffTime * 0.1;
    disp = clamp(disp, -0.03, 0.03);
  }

  // Leading distortion ahead of the ring
  float ahead = dist - safeFront;
  float leadProfile = smoothstep(0.25, 0.0, ahead) * smoothstep(-0.05, 0.02, ahead);
  float leadFade = smoothstep(0.0, 0.1, uProgress) * smoothstep(1.0, 0.5, uProgress);
  vec2 leadDisp = normalize(uv - center) * leadProfile * leadFade * 0.012;

  float sideEdge = min(uv.x, 1.0 - uv.x);
  float edgeFade = smoothstep(0.0, 0.03, sideEdge) * smoothstep(0.0, 0.3, uv.y);

  vec2 displacedUV = uv + (disp + leadDisp) * edgeFade * fadeEnvelope;

  // --- Caustic UV displacement: fluid refraction near the ring ---
  if (uCausticIntensity > 0.0) {
    float causticMask = scaleDiff;
    causticMask += exp(-abs(dist - front) * 6.0) * wp * 0.3;
    causticMask = clamp(causticMask, 0.0, 1.0) * fadeEnvelope;

    float aspect = iResolution.x / iResolution.y;
    vec2 noiseUV = uv * vec2(aspect, 1.0);
    // Two noise samples offset for x/y displacement
    float nx = snoise(noiseUV * 5.0 + uTime * 0.4);
    float ny = snoise(noiseUV * 5.0 + uTime * 0.4 + vec2(7.3, 3.1));
    displacedUV += vec2(nx, ny) * causticMask * uCausticIntensity * 0.015 * edgeFade;
  }

  displacedUV = clamp(displacedUV, 0.0, 1.0);
  vec2 finalUV = fitUV(displacedUV);
  finalUV = clamp(finalUV, vec2(0.0), vec2(1.0));

  // Chromatic aberration: offset R/G/B along radial direction, tight to ring only
  float abMask = smoothstep(spread * 0.2, 0.0, abs(dist - safeFront));
  float abStrength = abMask * uChromaticAberration * 0.008 * edgeFade * fadeEnvelope;
  vec2 abDir = normalize(uv - center);
  vec2 uvR = clamp(finalUV + abDir * abStrength, vec2(0.0), vec2(1.0));
  vec2 uvB = clamp(finalUV - abDir * abStrength, vec2(0.0), vec2(1.0));

  color.r = texture(uTexture, uvR).r;
  color.g = texture(uTexture, finalUV).g;
  color.b = texture(uTexture, uvB).b;
  color.a = texture(uTexture, finalUV).a;

  // --- Iridescent Glow ---
  float bloom = exp(-abs(dist - front) * 5.0) * wp * 0.08;

  vec3 iriColor = iridescentColor(uv, center, dist, front);
  float iriMask = smoothstep(spread, 0.0, abs(dist - safeFront)) * smoothstep(spread * 0.5, 0.0, abs(dist - safeFront));
  vec3 finalGlowColor = mix(uGlowColor, iriColor, uIridescence * iriMask);
  float ringGlow = scaleDiff * 0.4;
  color.rgb += (finalGlowColor * ringGlow * uGlowIntensity * fadeEnvelope
             + uGlowColor * bloom * uGlowIntensity * fadeEnvelope) * edgeFade;

  fragColor = color;
}
`;

export function ShineImageShader({
  imageUrl,
  scale = 10.0,
  sharpness = 0.7,
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
  chromaticAberration = 1.0,
  iridescence = 1.0,
  causticIntensity = 0.5,
  autoPlay = true,
}: ShineImageShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const hasAnimatedRef = useRef(false);
  const onLoadRef = useRef(onLoad);
  const durationRef = useRef(duration);
  const delayRef = useRef(delay);
  const autoPlayRef = useRef(autoPlay);
  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);
  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

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

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        uProgress: { value: 0 },
        uScale: { value: 1.0 },
        uSharpness: { value: 1.0 },
        uTexture: { value: placeholderTexture },
        uImageAspect: { value: 1.0 },
        uObjectFit: { value: 0.0 },
        uObjectPosition: { value: 0.5 },
        uBorderRadius: { value: 0 },
        uGlowIntensity: { value: 1.0 },
        uGlowColor: { value: new Float32Array([1, 1, 1]) },
        uBackgroundColor: { value: new Float32Array([0, 0, 0]) },
        uHasBackground: { value: 0.0 },
        uChromaticAberration: { value: 1.0 },
        uIridescence: { value: 1.0 },
        uCausticIntensity: { value: 0.5 },
        uTime: { value: 0 },
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
      if (!hasAnimatedRef.current && autoPlayRef.current) {
        hasAnimatedRef.current = true;
        animate(0, 1, {
          duration: durationRef.current,
          delay: delayRef.current,
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
    const startTime = performance.now();
    const loop = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (program.uniforms.uTime as any).value =
        (performance.now() - startTime) / 1000;
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
  }, [imageUrl]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const p = programRef.current;
    if (!p) return;
    (p.uniforms.uScale as any).value = scale;
    (p.uniforms.uSharpness as any).value = sharpness;
    (p.uniforms.uObjectFit as any).value = objectFit === 'contain' ? 1.0 : 0.0;
    (p.uniforms.uObjectPosition as any).value = objectPosition === 'top' ? 1.0 : 0.5;
    (p.uniforms.uBorderRadius as any).value = borderRadius ?? 0;
    (p.uniforms.uGlowIntensity as any).value = glowIntensity;
    const gv = hexToVec3(glowColor);
    (p.uniforms.uGlowColor as any).value = new Float32Array(gv);
    const bgv = backgroundColor ? hexToVec3(backgroundColor) : [0, 0, 0];
    (p.uniforms.uBackgroundColor as any).value = new Float32Array(bgv);
    (p.uniforms.uHasBackground as any).value = backgroundColor ? 1.0 : 0.0;
    (p.uniforms.uChromaticAberration as any).value = chromaticAberration;
    (p.uniforms.uIridescence as any).value = iridescence;
    (p.uniforms.uCausticIntensity as any).value = causticIntensity;
  }, [
    scale,
    sharpness,
    objectFit,
    objectPosition,
    borderRadius,
    glowIntensity,
    glowColor,
    backgroundColor,
    chromaticAberration,
    iridescence,
    causticIntensity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`.trim()}
      style={{ opacity: isTextureLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
}
