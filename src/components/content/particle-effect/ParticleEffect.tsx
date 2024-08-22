import { useRef, useMemo, useEffect, useState, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

import { ContentToCanvas } from './ContentToCanvas';

interface ParticleSystemProps {
  texture: THREE.Texture;
}
const ParticleSystem = ({ texture }: ParticleSystemProps) => {
  const points = useRef<THREE.Points>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
      },
      vertexShader: `
        attribute vec3 initialPosition;
        attribute vec3 targetPosition;
        uniform float progress;
        varying float vOpacity;

        void main() {
          vec3 pos;
          if (progress < 0.2) {
            pos = initialPosition;
            vOpacity = 1.0;
          } else {
            float scatterProgress = (progress - 0.2) / 0.8;
            pos = mix(initialPosition, targetPosition, scatterProgress);
            vOpacity = 1.0 - scatterProgress;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = mix(2.0, 0.5, progress);
        }
      `,
      fragmentShader: `
        varying float vOpacity;

        void main() {
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // FIXME: initial particle is awkward.
  const generateParticles = useMemo(() => {
    const particleCount = 10000;
    const initialPositions: number[] = [];
    const targetPositions: number[] = [];

    const aspectRatio = texture.image.width / texture.image.height;
    const fieldWidth = 10;
    const fieldHeight = fieldWidth / aspectRatio;

    // Create a temporary canvas to read pixel data
    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    const context = canvas.getContext('2d');

    if (context == null) {
      return;
    }

    context.drawImage(texture.image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let particlesCreated = 0;
    while (particlesCreated < particleCount) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.height);
      const i = (y * canvas.width + x) * 4;

      // Check if the pixel is not transparent (alpha > 0)
      if (pixels[i + 3] > 0) {
        const xPos = (x / canvas.width - 0.5) * fieldWidth;
        const yPos = (0.5 - y / canvas.height) * fieldHeight;

        initialPositions.push(xPos, yPos, 0);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        let distance = 2 + Math.random() * 3;
        const upwardBias = Math.max(0, Math.cos(phi));
        distance *= 1 + upwardBias;
        const horizontalSpread = 1.5;

        const targetX =
          xPos + horizontalSpread * distance * Math.sin(phi) * Math.cos(theta);
        const targetY = yPos + distance * Math.cos(phi);
        const targetZ =
          horizontalSpread * distance * Math.sin(phi) * Math.sin(theta);

        targetPositions.push(targetX, targetY, targetZ);

        particlesCreated++;
      }
    }

    return { initialPositions, targetPositions };
  }, [texture]);

  useEffect(() => {
    const animationDuration = 3000; // 3 seconds
    const startTime = Date.now();

    const animateParticles = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / animationDuration);

      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animateParticles);
      }
    };

    requestAnimationFrame(animateParticles);
  }, [texture, generateParticles]);

  useEffect(() => {
    if (points.current == null || generateParticles == null) {
      return;
    }

    const geometry = points.current.geometry;
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(generateParticles.initialPositions, 3)
    );
    geometry.setAttribute(
      'initialPosition',
      new THREE.Float32BufferAttribute(generateParticles.initialPositions, 3)
    );
    geometry.setAttribute(
      'targetPosition',
      new THREE.Float32BufferAttribute(generateParticles.targetPositions, 3)
    );
  }, [generateParticles]);

  useFrame(() => {
    if (points.current && 'uniforms' in points.current.material) {
      (
        points.current.material as THREE.ShaderMaterial
      ).uniforms.progress.value = animationProgress;
    }
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry />
        <primitive object={shaderMaterial} attach="material" />
      </points>
    </group>
  );
};

interface ParticleEffectProps {
  children: ReactNode;
}
export const ParticleEffect = ({ children }: ParticleEffectProps) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      html2canvas(contentRef.current, { backgroundColor: null }).then(
        canvas => {
          const newTexture = new THREE.CanvasTexture(canvas);
          setTexture(newTexture);
        }
      );
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: startAnimation ? 'hidden' : 'visible',
          color: 'white',
        }}
      >
        {children}
      </div>
      {texture && (
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={['#000000']} />
          <OrbitControls />
          {!startAnimation ? (
            <mesh>
              <planeGeometry
                args={[10, 10 * (texture.image.height / texture.image.width)]}
              />
              <meshBasicMaterial>
                <primitive attach="map" object={texture} />
              </meshBasicMaterial>
            </mesh>
          ) : (
            <ParticleSystem texture={texture} />
          )}
        </Canvas>
      )}
      <button
        onClick={() => setStartAnimation(true)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Start Animation
      </button>
    </div>
  );
};
