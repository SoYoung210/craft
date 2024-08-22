import {
  useRef,
  useMemo,
  useEffect,
  useState,
  ReactNode,
  CSSProperties,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

/**
 * NOTE
 *FIXME: 1) initial particle is awkward.
 * -> It can be solved by set opacity to 0 when scattering is not started.
 */
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
        attribute vec3 color;
        uniform float progress;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vec3 pos = mix(initialPosition, targetPosition, progress);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = mix(2.0, 0.5, progress);
          vOpacity = 1.0 - progress;
          vColor = color;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  const generateParticles = useMemo(() => {
    // TODO: performance test
    const particleCount = 50000;
    const initialPositions: number[] = [];
    const targetPositions: number[] = [];
    const colors: number[] = [];

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

    const nonTransparentPixels: [number, number][] = [];
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (pixels[i + 3] > 0) {
          nonTransparentPixels.push([x, y]);
        }
      }
    }

    const totalPixels = nonTransparentPixels.length;
    const particlesPerPixel = Math.max(
      1,
      Math.min(5, Math.floor(particleCount / totalPixels))
    );
    const totalParticles = Math.min(
      particleCount,
      totalPixels * particlesPerPixel
    );

    for (let i = 0; i < totalParticles; i++) {
      const [x, y] =
        nonTransparentPixels[Math.floor(Math.random() * totalPixels)];

      const xOffset = (Math.random() - 0.5) / canvas.width;
      const yOffset = (Math.random() - 0.5) / canvas.height;

      const xPos = (x / canvas.width + xOffset - 0.5) * fieldWidth;
      const yPos = (0.5 - y / canvas.height - yOffset) * fieldHeight;

      initialPositions.push(xPos, yPos, 0);

      // Get color from pixel
      const pixelIndex = (y * canvas.width + x) * 4;
      colors.push(
        pixels[pixelIndex] / 255,
        pixels[pixelIndex + 1] / 255,
        pixels[pixelIndex + 2] / 255
      );

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
    }

    return { initialPositions, targetPositions, colors };
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
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(generateParticles.colors, 3)
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
  // custom target `html2Canvas` element's style
  style?: CSSProperties;
  className?: string;
}
export const ParticleEffect = (props: ParticleEffectProps) => {
  const { children, className, style } = props;
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current == null) {
      return;
    }

    html2canvas(contentRef.current, {
      backgroundColor: null,
      allowTaint: true,
    }).then(canvas => {
      const newTexture = new THREE.CanvasTexture(canvas);
      setTexture(newTexture);
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={contentRef}
        className={className}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: startAnimation ? 'hidden' : 'visible',
          color: 'white',
          ...style,
        }}
      >
        {children}
      </div>
      {texture && (
        // NOTE: linear: https://github.com/pmndrs/react-three-fiber/discussions/1290#discussioncomment-668649
        <Canvas linear camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={['#000000']} />
          <OrbitControls />
          {!startAnimation ? (
            <mesh>
              <planeGeometry
                args={[10, 10 * (texture.image.height / texture.image.width)]}
              />
              <meshBasicMaterial transparent={true} toneMapped={false}>
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
