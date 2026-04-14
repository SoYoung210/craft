'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { Mesh, Program, RenderTarget, Renderer, Texture, Triangle } from 'ogl';

interface PhotoAspirationShaderProps {
  imageUrl: string;
  className?: string;
  targetProgress?: number;
  duration?: number;
  delay?: number;
  darknessAmount?: number;
  initialProgress?: number;
}

const vertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const trailFragment = `#version 300 es
precision highp float;

uniform sampler2D uPrevTrail;
uniform vec2  iResolution;
uniform vec2  uMouseNormPos;
uniform vec2  uMouseNormVel;
uniform float uMouseStrength;
uniform float uDissipation;

out vec4 fragColor;

void main() {
  vec2 uv  = gl_FragCoord.xy / iResolution;

  vec2 vel = texture(uPrevTrail, uv).rg;

  vec2 advectedUv = clamp(uv - vel * 0.25, 0.001, 0.999);
  vec2 result     = texture(uPrevTrail, advectedUv).rg * uDissipation;

  float aspect  = iResolution.x / iResolution.y;
  vec2  delta   = uv - uMouseNormPos;
  delta.x      *= aspect;
  float splatR  = 0.06;
  float falloff = exp(-dot(delta, delta) / (splatR * splatR));
  result       += uMouseNormVel * falloff * uMouseStrength * 1.5;

  result = clamp(result, -0.5, 0.5);

  fragColor = vec4(result, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float uProgress;
uniform float uTime;
uniform float uImageAspect;
uniform float uCellSizeStart;
uniform float uCellSizeEnd;
uniform float uLoaderZoomStart;
uniform float uBackgroundBlurPx;
uniform float uGridBlurMix;
uniform float uDarknessAmount;
uniform float uContainToCover;
uniform sampler2D uTexture;
uniform sampler2D uTrailTexture;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

vec2 coverUv(vec2 uv) {
  float canvasAspect = iResolution.x / iResolution.y;
  vec2 outUv = uv;
  if (canvasAspect > uImageAspect) {
    float ratio = uImageAspect / canvasAspect;
    outUv.y = (uv.y - 0.5) * ratio + 0.5;
  } else {
    float ratio = canvasAspect / uImageAspect;
    outUv.x = (uv.x - 0.5) * ratio + 0.5;
  }
  return outUv;
}

vec2 containUv(vec2 uv) {
  float canvasAspect = iResolution.x / iResolution.y;
  vec2 outUv = uv;
  if (canvasAspect > uImageAspect) {
    float scale = canvasAspect / uImageAspect;
    outUv.x = (uv.x - 0.5) * scale + 0.5;
  } else {
    float scale = uImageAspect / canvasAspect;
    outUv.y = (uv.y - 0.5) * scale + 0.5;
  }
  return outUv;
}

vec2 samplingUv(vec2 uv) {
  return mix(containUv(uv), coverUv(uv), uContainToCover);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;

  vec2 imageUv = samplingUv(uv);

  if (imageUv.x < 0.0 || imageUv.x > 1.0 || imageUv.y < 0.0 || imageUv.y > 1.0) {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  float loaderBuild = smoothstep(0.0, 0.35, uProgress);
  float revealPhase = smoothstep(0.35, 1.0, uProgress);

  float imageZoom = mix(1.2, 1.0, loaderBuild);
  vec2 zoomedUv = ((imageUv - 0.5) / imageZoom) + vec2(0.5);

  if (zoomedUv.x < 0.0 || zoomedUv.x > 1.0 || zoomedUv.y < 0.0 || zoomedUv.y > 1.0) {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  vec4 src = texture(uTexture, zoomedUv);
  float luma = dot(src.rgb, vec3(0.299, 0.587, 0.114));

  vec3 contrastColor = clamp((src.rgb - 0.5) * 1.28 + 0.5, 0.0, 1.0);
  vec3 shadowLean = vec3(0.05098);
  float shadowMask = 1.0 - smoothstep(0.06, 0.52, luma);
  vec3 gradedColor = mix(contrastColor, shadowLean, shadowMask * 0.72);

  float cellSize = mix(uCellSizeStart, uCellSizeEnd, revealPhase);
  vec2 cellCoord = gl_FragCoord.xy / cellSize;
  vec2 cellId = floor(cellCoord);
  vec2 cellLocal = fract(cellCoord);
  vec2 cellCenterUv = (cellId * cellSize + (cellSize * 0.5)) / iResolution;
  vec2 cellImageUv = samplingUv(cellCenterUv);
  float loaderZoom = mix(uLoaderZoomStart, 1.0, revealPhase);
  vec2 loaderSampleUv = ((cellImageUv - 0.5) / loaderZoom) + vec2(0.5, 0.5);
  loaderSampleUv = clamp(loaderSampleUv, 0.0, 1.0);

  float blurRadiusPx = max(0.0, mix(48.0, uBackgroundBlurPx, revealPhase));
  vec2 blurOffset = vec2(blurRadiusPx / iResolution.x, blurRadiusPx / iResolution.y);

  vec4 cellSample   = texture(uTexture, loaderSampleUv);
  vec4 blurA        = texture(uTexture, clamp(loaderSampleUv + vec2( blurOffset.x,  0.0),        0.0, 1.0));
  vec4 blurB        = texture(uTexture, clamp(loaderSampleUv - vec2( blurOffset.x,  0.0),        0.0, 1.0));
  vec4 blurC        = texture(uTexture, clamp(loaderSampleUv + vec2( 0.0,  blurOffset.y),        0.0, 1.0));
  vec4 blurD        = texture(uTexture, clamp(loaderSampleUv - vec2( 0.0,  blurOffset.y),        0.0, 1.0));
  vec4 blurDiagA    = texture(uTexture, clamp(loaderSampleUv +  blurOffset,                      0.0, 1.0));
  vec4 blurDiagB    = texture(uTexture, clamp(loaderSampleUv -  blurOffset,                      0.0, 1.0));
  vec4 blurDiagC    = texture(uTexture, clamp(loaderSampleUv + vec2( blurOffset.x, -blurOffset.y), 0.0, 1.0));
  vec4 blurDiagD    = texture(uTexture, clamp(loaderSampleUv + vec2(-blurOffset.x,  blurOffset.y), 0.0, 1.0));

  vec4 blurredCellSample = (
    (cellSample * 2.0) + blurA + blurB + blurC + blurD +
    blurDiagA + blurDiagB + blurDiagC + blurDiagD
  ) / 10.0;

  float gridBlurStrength = mix(1.0, uGridBlurMix, revealPhase);
  vec3 squareColor = mix(cellSample.rgb, blurredCellSample.rgb, gridBlurStrength);
  squareColor = clamp((squareColor - 0.5) * 1.08 + 0.5, 0.0, 1.0);

  float blobTime = uTime * 0.25;
  float vhPx = iResolution.y * 0.01;

  vec2 blobCenterA = vec2(
    0.5 + 0.24 * sin(blobTime * 0.83) + 0.09 * sin(blobTime * 1.47 + 1.3),
    0.5 + 0.22 * cos(blobTime * 0.71 + 0.9) + 0.07 * sin(blobTime * 1.19 + 2.1)
  ) * iResolution;
  vec2 blobCenterB = vec2(
    0.5 + 0.18 * cos(blobTime * 1.11 + 2.4) + 0.12 * sin(blobTime * 0.93 + 0.6),
    0.5 + 0.2  * sin(blobTime * 0.88 + 1.7) + 0.08 * cos(blobTime * 1.36 + 0.4)
  ) * iResolution;
  vec2 blobCenterC = vec2(
    0.5 + 0.22 * sin(blobTime * 0.69 + 0.2) + 0.1  * cos(blobTime * 1.28 + 2.2),
    0.5 + 0.16 * cos(blobTime * 1.02 + 2.8) + 0.13 * sin(blobTime * 0.74 + 1.1)
  ) * iResolution;

  vec2 blobDeltaA = gl_FragCoord.xy - blobCenterA;
  vec2 blobDeltaB = gl_FragCoord.xy - blobCenterB;
  vec2 blobDeltaC = gl_FragCoord.xy - blobCenterC;

  vec2 blobScaleA = vec2(
    mix(10.0, 25.0, 0.5 + 0.5 * sin(blobTime * 0.91 + 0.2)),
    mix(10.0, 25.0, 0.5 + 0.5 * cos(blobTime * 1.17 + 1.4))
  ) * vhPx * 2.0;
  vec2 blobScaleB = vec2(
    mix(10.0, 25.0, 0.5 + 0.5 * cos(blobTime * 0.78 + 2.1)),
    mix(10.0, 25.0, 0.5 + 0.5 * sin(blobTime * 1.26 + 0.8))
  ) * vhPx * 2.0;
  vec2 blobScaleC = vec2(
    mix(10.0, 25.0, 0.5 + 0.5 * sin(blobTime * 1.08 + 2.7)),
    mix(10.0, 25.0, 0.5 + 0.5 * cos(blobTime * 0.84 + 0.5))
  ) * vhPx * 2.0;

  vec2 blobWarpA = vec2(
    blobDeltaA.x + sin(blobDeltaA.y * 0.014 + blobTime * 1.3)  * 18.0,
    blobDeltaA.y + cos(blobDeltaA.x * 0.012 + blobTime * 1.1)  * 14.0
  );
  vec2 blobWarpB = vec2(
    blobDeltaB.x + cos(blobDeltaB.y * 0.011 + blobTime * 1.2)  * 16.0,
    blobDeltaB.y + sin(blobDeltaB.x * 0.013 + blobTime * 1.45) * 12.0
  );
  vec2 blobWarpC = vec2(
    blobDeltaC.x + sin(blobDeltaC.y * 0.015 + blobTime * 0.95) * 20.0,
    blobDeltaC.y + cos(blobDeltaC.x * 0.01  + blobTime * 1.34) * 15.0
  );

  float blobDistA = length(blobWarpA / max(blobScaleA, vec2(1.0)));
  float blobDistB = length(blobWarpB / max(blobScaleB, vec2(1.0)));
  float blobDistC = length(blobWarpC / max(blobScaleC, vec2(1.0)));

  float blobA = 1.0 - smoothstep(0.7, 1.05, blobDistA);
  float blobB = 1.0 - smoothstep(0.7, 1.05, blobDistB);
  float blobC = 1.0 - smoothstep(0.7, 1.05, blobDistC);
  float pixelStage = smoothstep(0.10, 0.60, uv.y);

  float blobInfluence = max(blobA, max(blobB, blobC)) * pixelStage;

  float strokeWidthPx  = mix(10.0, 8.0, blobInfluence);

  vec2  trailUv     = gl_FragCoord.xy / iResolution;
  vec4  trailSample = texture(uTrailTexture, trailUv);
  vec2  velocity    = trailSample.rg;
  float trailMag    = clamp(length(velocity) * 3.0, 0.0, 1.0);
  vec2  trailDir    = length(velocity) > 0.001 ? normalize(velocity) : vec2(0.0);

  vec2 dispCellLocal = clamp(cellLocal + trailDir * trailMag * 0.22, 0.01, 0.99);

  float innerStrokeUv  = max(0.02, min(0.48, strokeWidthPx / max(cellSize, 1.0)) - trailMag * 0.10);
  float cornerRadiusUv = min(0.2, 2.0 / max(cellSize, 1.0));
  float strokeSoftness = max(0.002, 0.6 / max(cellSize, 1.0));
  vec2 innerMin     = vec2(innerStrokeUv);
  vec2 innerMax     = vec2(1.0 - innerStrokeUv);
  vec2 innerCenter  = (innerMin + innerMax) * 0.5;
  vec2 innerHalfSize = max(vec2(0.001), (innerMax - innerMin) * 0.5);
  vec2 roundedPoint = abs(dispCellLocal - innerCenter);
  vec2 q            = roundedPoint - innerHalfSize + vec2(cornerRadiusUv);
  float roundedDistance = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - cornerRadiusUv;
  float innerMask   = 1.0 - smoothstep(0.0, strokeSoftness, roundedDistance);

  vec3 strokeColor  = shadowLean;
  vec3 dotGridColor = mix(strokeColor, squareColor, innerMask * pixelStage);
  vec3 loaderColor  = mix(strokeColor, dotGridColor, loaderBuild);

  float revealActive = smoothstep(0.02, 0.12, revealPhase);
  float grain = hash(cellId + vec2(0.17, 0.09));
  float sweep = revealActive * smoothstep(
    -0.15, 0.15,
    revealPhase - (1.0 - uv.y) + (grain - 0.5) * 0.12
  );
  vec3 revealedComposite = mix(gradedColor, loaderColor, 0.18);
  vec3 stageColor        = mix(loaderColor, revealedComposite, sweep);
  float loaderOnlyPhase  = 1.0 - revealActive;
  vec3 preFinalColor     = mix(gradedColor, loaderColor, loaderBuild);
  vec3 loaderPhaseColor  = mix(preFinalColor, loaderColor, loaderOnlyPhase * loaderBuild);
  vec3 finalColor        = mix(loaderPhaseColor, stageColor, revealActive);

  finalColor = mix(finalColor, finalColor * 0.3, uDarknessAmount * loaderBuild);

  finalColor = mix(finalColor, gradedColor, trailMag * 0.9);

  fragColor = vec4(finalColor, src.a);
}
`;

export function PhotoAspirationShader({
  imageUrl,
  className,
  targetProgress = 0.35,
  duration = 1.8,
  delay = 0,
  darknessAmount = 0.55,
  initialProgress = 0,
}: PhotoAspirationShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const progressRef = useRef(initialProgress);
  const isImageLoadedRef = useRef(false);
  const [imageLoadTick, setImageLoadTick] = useState(0);
  const ctrlRef = useRef<ReturnType<typeof animate> | null>(null);

  const trailTargetsRef = useRef<[RenderTarget, RenderTarget] | null>(null);
  const trailProgramRef = useRef<Program | null>(null);
  const trailMeshRef = useRef<Mesh | null>(null);
  const trailReadIdxRef = useRef(0);

  const actualMouseRef = useRef({ x: -9999, y: -9999, active: 0 });
  const prevSmoothPosRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!containerRef.current) return;

    let isDisposed = false;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    renderer.gl.clearColor(0, 0, 0, 0);
    const gl = renderer.gl;
    const { HALF_FLOAT, RGBA16F } = gl as unknown as WebGL2RenderingContext;
    gl.getExtension('EXT_color_buffer_float');
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';

    const container = containerRef.current;
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    const initRect = container.getBoundingClientRect();
    const tw = Math.max(1, Math.floor(initRect.width / 3));
    const th = Math.max(1, Math.floor(initRect.height / 3));

    const trailTargets: [RenderTarget, RenderTarget] = [
      new RenderTarget(gl, {
        width: tw,
        height: th,
        type: HALF_FLOAT,
        internalFormat: RGBA16F,
        format: gl.RGBA,
      }),
      new RenderTarget(gl, {
        width: tw,
        height: th,
        type: HALF_FLOAT,
        internalFormat: RGBA16F,
        format: gl.RGBA,
      }),
    ];
    trailTargetsRef.current = trailTargets;

    const trailProgram = new Program(gl, {
      vertex,
      fragment: trailFragment,
      uniforms: {
        iResolution: { value: new Float32Array([tw, th]) },
        uPrevTrail: { value: trailTargets[0].texture },
        uMouseNormPos: { value: new Float32Array([0.5, 0.5]) },
        uMouseNormVel: { value: new Float32Array([0.0, 0.0]) },
        uMouseStrength: { value: 0 },
        uDissipation: { value: 0.97 },
      },
    });
    trailProgramRef.current = trailProgram;
    trailMeshRef.current = new Mesh(gl, { geometry, program: trailProgram });

    const placeholderTexture = new Texture(gl, {
      image: new Uint8Array([8, 10, 16, 255]),
      width: 1,
      height: 1,
      generateMipmaps: false,
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        uProgress: { value: initialProgress },
        uTime: { value: 0 },
        uImageAspect: { value: 1 },
        uCellSizeStart: { value: 21 },
        uCellSizeEnd: { value: 21 },
        uLoaderZoomStart: { value: 1 },
        uBackgroundBlurPx: { value: 18 },
        uGridBlurMix: { value: 0.9 },
        uDarknessAmount: { value: darknessAmount },
        uContainToCover: { value: 1 },
        uTrailTexture: { value: trailTargets[0].texture },
        uTexture: { value: placeholderTexture },
      },
    });

    programRef.current = program;
    const mesh = new Mesh(gl, { geometry, program });

    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    image.onload = () => {
      if (isDisposed) return;

      const texture = new Texture(gl, {
        image,
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        flipY: true,
      });

      (program.uniforms.uTexture as any).value = texture;
      (program.uniforms.uImageAspect as any).value =
        image.naturalWidth / image.naturalHeight;
      isImageLoadedRef.current = true;
      setImageLoadTick(t => t + 1);
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const resolution = program.uniforms.iResolution.value as Float32Array;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;

      const ntw = Math.max(1, Math.floor(width / 3));
      const nth = Math.max(1, Math.floor(height / 3));
      if (trailTargetsRef.current) {
        trailTargetsRef.current[0].setSize(ntw, nth);
        trailTargetsRef.current[1].setSize(ntw, nth);
      }
      if (trailProgramRef.current) {
        const tr = trailProgramRef.current.uniforms.iResolution
          .value as Float32Array;
        tr[0] = ntw;
        tr[1] = nth;
      }
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;

    const render = () => {
      if (isDisposed) return;

      const time = program.uniforms.uTime.value as number;
      (program.uniforms.uTime as any).value = time + 1 / 60;

      const am = actualMouseRef.current;
      const rect = container.getBoundingClientRect();
      const normX = am.x / rect.width;
      const normY = am.y / rect.height;
      const prev = prevSmoothPosRef.current;
      const normVelX = (am.x - prev.x) / rect.width;
      const normVelY = (am.y - prev.y) / rect.height;
      prev.x = am.x;
      prev.y = am.y;

      if (
        trailProgramRef.current &&
        trailTargetsRef.current &&
        trailMeshRef.current
      ) {
        const readIdx = trailReadIdxRef.current;
        const writeIdx = 1 - readIdx;
        const tp = trailProgramRef.current;
        const targets = trailTargetsRef.current;

        (tp.uniforms.uPrevTrail as any).value = targets[readIdx].texture;
        const velMag = Math.sqrt(normVelX * normVelX + normVelY * normVelY);
        const movementStrength =
          am.active > 0 ? Math.min(1.0, velMag * 80.0) : 0;

        (tp.uniforms.uMouseStrength as any).value = movementStrength;

        const normPos = tp.uniforms.uMouseNormPos.value as Float32Array;
        normPos[0] = normX;
        normPos[1] = 1.0 - normY;

        const normVel = tp.uniforms.uMouseNormVel.value as Float32Array;
        normVel[0] = normVelX;
        normVel[1] = -normVelY;

        renderer.render({
          scene: trailMeshRef.current,
          target: targets[writeIdx] as any,
        });

        trailReadIdxRef.current = writeIdx;

        (program.uniforms.uTrailTexture as any).value =
          targets[writeIdx].texture;
      }

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      actualMouseRef.current.x = x;
      actualMouseRef.current.y = y;
      actualMouseRef.current.active =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height ? 1 : 0;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
      programRef.current = null;
      trailProgramRef.current = null;
      trailMeshRef.current = null;
      trailTargetsRef.current = null;
      isImageLoadedRef.current = false;
      progressRef.current = initialProgress;
      trailReadIdxRef.current = 0;

      try {
        container.removeChild(canvas);
      } catch {
        // noop
      }
    };
  }, [imageUrl, darknessAmount, initialProgress]);

  useEffect(() => {
    if (!programRef.current || !isImageLoadedRef.current) return;

    const next = Math.max(0, Math.min(1, targetProgress));
    const prev = progressRef.current;
    if (Math.abs(prev - next) < 0.001) return;

    const timeoutId = setTimeout(() => {
      const ctrl = animate(prev, next, {
        duration,
        ease: [0.17, 0.89, 0.3, 1],
        onUpdate: v => {
          progressRef.current = v;
          if (!programRef.current) return;
          (programRef.current.uniforms.uProgress as any).value = v;
        },
      });
      ctrlRef.current = ctrl;
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      ctrlRef.current?.stop();
    };
  }, [delay, duration, targetProgress, imageLoadTick]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: 'transparent' }}
    />
  );
}
