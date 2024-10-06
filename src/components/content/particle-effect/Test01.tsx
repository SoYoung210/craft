import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';

const ParticleMaterial = shaderMaterial(
  {
    u_AnimationDuration: 0,
    u_ParticleSize: 0,
    u_ElapsedTime: 0,
    u_ViewportWidth: 0,
    u_ViewportHeight: 0,
    u_TextureWidth: 0,
    u_TextureHeight: 0,
    u_TextureLeft: 0,
    u_TextureTop: 0,
    u_Texture: null,
  },
  // Vertex Shader
  `
    precision highp float;

    uniform float u_AnimationDuration;
    uniform float u_ParticleSize;
    uniform float u_ElapsedTime;
    uniform float u_ViewportWidth;
    uniform float u_ViewportHeight;
    uniform float u_TextureWidth;
    uniform float u_TextureHeight;
    uniform float u_TextureLeft;
    uniform float u_TextureTop;

    attribute float a_ParticleIndex;

    varying vec2 v_ParticleCoord;
    varying float v_ParticleLifetime;

    float random(float v) {
        return fract(sin(v) * 100000.0);
    }

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float random(float v, float mult) {
        return fract(10000.0 * random(v) * random(v) * mult);
    }

    float normalizeX(float x) {
        return 2.0 * x / u_ViewportWidth - 1.0;
    }

    float normalizeY(float y) {
        return 1.0 - 2.0 * y / u_ViewportHeight;
    }

    float interpolateLinear(float start, float end, float factor) {
        return start + factor * (end - start);
    }

    vec2 getPositionFromIndex(float particleSize, float index) {
        float y = floor(index / u_TextureWidth);
        float x = index - y * u_TextureWidth;
        return vec2(
            particleSize * (x + 0.5) + u_TextureLeft,
            particleSize * (u_TextureHeight - y - 0.5) + u_TextureTop
        );
    }

    vec2 calculateBlowAwayEffect(vec2 position, float r, float factor) {
        float normalizedX = normalizeX(position.x);
        float normalizedY = normalizeY(position.y);

        // Adjust these values to control the direction and intensity of the blow-away effect
        float xOffset = 0.8;  // Positive value moves particles to the right
        float yOffset = -0.0;  // Positive value moves particles up

        float x = interpolateLinear(
            normalizedX,
            normalizedX + xOffset + (random(normalizedY, r) - 0.3),
            factor * 0.4
        );
        float y = interpolateLinear(
            normalizedY,
            normalizedY + yOffset + (random(normalizedX, r) - 0.125),
            factor * 0.2
        );

        return vec2(x, y);
    }


    void main() {
        vec2 position = getPositionFromIndex(u_ParticleSize, a_ParticleIndex);
        float r = random(position);
        float particleAnimationMinTime = u_AnimationDuration / 4.0;
        float particleAnimationTotalTime = particleAnimationMinTime * (1.0 + r);
        float particleAnimationDelay = position.x / u_ViewportWidth * particleAnimationMinTime;

        float particleLifetime = min(u_ElapsedTime / (particleAnimationDelay + particleAnimationTotalTime), 1.0);
        float acceleration = 1.0 + 3.0 * (position.x / u_ViewportWidth);

        vec2 blownPosition = calculateBlowAwayEffect(position, r, pow(particleLifetime, acceleration));
        gl_Position = vec4(blownPosition, 0.0, 1.0);
        gl_PointSize = u_ParticleSize;

        v_ParticleLifetime = particleLifetime;

        vec2 textureOffset = vec2(u_TextureLeft, u_TextureTop);
        vec2 originalTextureSize = vec2(u_TextureWidth * u_ParticleSize, u_TextureHeight * u_ParticleSize);
        v_ParticleCoord = (position - textureOffset) / originalTextureSize;
        v_ParticleCoord.y = 1.0 - v_ParticleCoord.y;
    }
  `,
  // Fragment Shader
  `
    precision highp float;

    uniform sampler2D u_Texture;

    varying vec2 v_ParticleCoord;
    varying float v_ParticleLifetime;

    float interpolateLinear(float start, float end, float factor) {
      return start + factor * (end - start);
    }

    void main() {
      if (v_ParticleLifetime == 1.0) {
          discard;
      }
      vec4 textureColor = texture2D(u_Texture, v_ParticleCoord);
      if (textureColor.a == 0.0) {
          discard;
      }

      vec2 center = vec2(0.5, 0.5);
      float distanceToCenter = distance(center, gl_PointCoord);
      float visibilityFactor = pow(v_ParticleLifetime, 5.);
      if (distanceToCenter > 1.0 - visibilityFactor) {
          discard;
      }

      float alpha = mix(textureColor.a, 0.0, pow(visibilityFactor, 1.5));
      gl_FragColor = vec4(textureColor.xyz, alpha);
    }
  `
);

extend({ ParticleMaterial });

interface ParticleSystemProps {
  texture: THREE.Texture;
  dimensions: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
}
const duration = 2400;
const particleSize = 1;
const ParticleSystem = ({ texture, dimensions }: ParticleSystemProps) => {
  const mesh = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const animationStartTime = useRef<number | null>(null);
  const { size } = useThree();

  const [particlesCount, setParticlesCount] = useState(0);

  useEffect(() => {
    const rect = dimensions;
    const textureWidth = Math.round(rect.width / particleSize);
    const textureHeight = Math.round(rect.height / particleSize);
    setParticlesCount(textureWidth * textureHeight);

    if (material.current) {
      material.current.uniforms.u_Texture.value = texture;
      material.current.uniforms.u_AnimationDuration.value = duration;
      material.current.uniforms.u_ParticleSize.value = particleSize;
      material.current.uniforms.u_ViewportWidth.value = size.width;
      material.current.uniforms.u_ViewportHeight.value = size.height;
      material.current.uniforms.u_TextureWidth.value = textureWidth;
      material.current.uniforms.u_TextureHeight.value = textureHeight;
      material.current.uniforms.u_TextureLeft.value = rect.left;
      material.current.uniforms.u_TextureTop.value = rect.top;
    }
    console.log('Texture set:', material.current?.uniforms.u_Texture.value);
    console.log('Particle count:', particlesCount);
    console.log('Particles setup:', {
      textureWidth,
      textureHeight,
      particlesCount,
    });
    // Optionally, remove the original element after capturing
    // elementRef.current.style.display = 'none';
  }, [size, particlesCount, dimensions, texture]);

  const { particles, positions } = useMemo(() => {
    const textureWidth = Math.round(dimensions.width / particleSize);
    const textureHeight = Math.round(dimensions.height / particleSize);
    const particlesCount = textureWidth * textureHeight;
    const particleIndices = new Float32Array(particlesCount);
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      particleIndices[i] = i;
      const x = (i % textureWidth) / textureWidth;
      const y = Math.floor(i / textureWidth) / textureHeight;
      particlePositions[i * 3] = (x - 0.5) * 2;
      particlePositions[i * 3 + 1] = (0.5 - y) * 2;
      particlePositions[i * 3 + 2] = 0;
    }
    return { particles: particleIndices, positions: particlePositions };
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    const animationDuration = duration;
    const startTime = Date.now();

    const animateParticles = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(1, elapsedTime / animationDuration);
      if (elapsedTime > animationDuration) {
        // animationStartTime = -1;
        return;
      }
      // setAnimationProgress(progress);
      if (material.current) {
        material.current.uniforms.u_ElapsedTime.value = elapsedTime;
      }

      if (progress < 1) {
        requestAnimationFrame(animateParticles);
      }
    };

    requestAnimationFrame(animateParticles);
  }, []);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-a_ParticleIndex"
          count={particles.length}
          array={particles}
          itemSize={1}
        />
      </bufferGeometry>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <particleMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

interface Props {
  children: React.ReactNode;
}
export default function Scene({ children }: Props) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentDimensions, setContentDimensions] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateDimensions = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        console.log('Updated dimensions:', rect);
        setContentDimensions({
          width: rect.width,
          height: rect.height,
          // left: 0,
          // top: rect.height * 0.5,
          left: rect.left,
          top: rect.top,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(contentRef.current);

    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (contentRef.current == null) {
      return;
    }

    html2canvas(contentRef.current, {
      backgroundColor: null,
      allowTaint: true,
      width: contentDimensions.width,
      height: contentDimensions.height,
    }).then(canvas => {
      const newTexture = new THREE.CanvasTexture(canvas);

      setTexture(newTexture);
    });
  }, [contentDimensions.height, contentDimensions.width]);

  console.log('contentDimensions', contentDimensions);
  console.log('texture', texture?.image.height, texture?.image.width);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={contentRef}
        style={{
          // visibility: startAnimation ? 'hidden' : 'visible',
          width: 'fit-content',
          color: 'white',
        }}
      >
        {children}
      </div>
      {texture && (
        // NOTE: linear: https://github.com/pmndrs/react-three-fiber/discussions/1290#discussioncomment-668649
        <Canvas
          linear
          style={{
            // width: 600,
            height: contentDimensions.height * 20,
          }}
        >
          <color attach="background" args={['#000000']} />
          <OrbitControls enableRotate={false} />
          {!startAnimation ? (
            <mesh position={[0, 0, 0]}>
              <planeGeometry
                args={[1, 1 * (texture.image.height / texture.image.width)]}
              />
              <meshBasicMaterial transparent={true} toneMapped={false}>
                <primitive attach="map" object={texture} />
              </meshBasicMaterial>
            </mesh>
          ) : (
            <ParticleSystem texture={texture} dimensions={contentDimensions} />
          )}
          {/* <ParticleSystem texture={texture} dimensions={contentDimensions} /> */}
        </Canvas>
      )}
      <button
        onClick={() => setStartAnimation(true)}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Start Animation
      </button>
    </div>
  );
}
