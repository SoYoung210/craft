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
 *FIXME: 
  1. Real Tanos Effect를 향한 여정...
 * float particleProgress = smoothstep(sweepProgress - 0.1, sweepProgress, initialPosition.x / 5.0 + 0.5);
  이 부분 때문에 파티클이 전혀 움직이지 않는거였음... 약간의 딜레이가 필요하긴한데, 이걸 어떻게 전달한담?
 */
interface ParticleSystemProps {
  texture: THREE.Texture;
  dimensions: { width: number; height: number };
}
const ParticleSystem = ({ texture, dimensions }: ParticleSystemProps) => {
  const particles = useRef<THREE.Points>(null);
  const content = useRef<THREE.Mesh>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const contentShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        textureSampler: { value: texture },
        progress: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D textureSampler;
        uniform float progress;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(textureSampler, vUv);
          float alpha = smoothstep(progress, progress + 0.1, vUv.x);
          gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
        }
      `,
      transparent: true,
    });
  }, [texture]);

  const particleShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
      },
      vertexShader: `
        attribute vec3 initialPosition;
        attribute vec3 finalPosition;
        attribute vec3 color;
        uniform float progress;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          float particleProgress = smoothstep(0.0, 1.0, (progress - uv.x) * 5.0);
          particleProgress = clamp(particleProgress, 0.0, 1.0);
          vec3 pos = mix(initialPosition, finalPosition, particleProgress);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

          gl_PointSize = mix(2.0, 1.0, particleProgress);

          vOpacity = 1.0 - step(0.99, particleProgress);
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
    const particleCount = 100000;
    const initialPositions: number[] = [];
    const finalPositions: number[] = [];
    const colors: number[] = [];
    const uvs: number[] = [];

    const aspectRatio = dimensions.width / dimensions.height;
    const fieldWidth = 10;
    const fieldHeight = fieldWidth / aspectRatio;

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

      const pixelIndex = (y * canvas.width + x) * 4;
      colors.push(
        pixels[pixelIndex] / 255,
        pixels[pixelIndex + 1] / 255,
        pixels[pixelIndex + 2] / 255
      );

      uvs.push(x / canvas.width, y / canvas.height);

      const xNormalized = x / canvas.width;
      const spread = 3 - xNormalized * 2;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * spread;

      const finalX = xPos + Math.cos(angle) * distance;
      const finalY = yPos + Math.sin(angle) * distance;
      finalPositions.push(finalX, finalY, 0);
    }

    return { initialPositions, finalPositions, colors, uvs };
  }, [dimensions.height, dimensions.width, texture.image]);

  useEffect(() => {
    if (!particles.current || !generateParticles) return;

    const geometry = particles.current.geometry;
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(generateParticles.initialPositions, 3)
    );
    geometry.setAttribute(
      'initialPosition',
      new THREE.Float32BufferAttribute(generateParticles.initialPositions, 3)
    );
    geometry.setAttribute(
      'finalPosition',
      new THREE.Float32BufferAttribute(generateParticles.finalPositions, 3)
    );
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(generateParticles.colors, 3)
    );
    geometry.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(generateParticles.uvs, 2)
    );

    geometry.computeBoundingSphere();
  }, [generateParticles]);

  useEffect(() => {
    const animationDuration = 2000;
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
  }, []);

  useFrame(() => {
    if (particles.current && content.current) {
      const particleMaterial = particles.current
        .material as THREE.ShaderMaterial;
      const contentMaterial = content.current.material as THREE.ShaderMaterial;

      particleMaterial.uniforms.progress.value = animationProgress;
      contentMaterial.uniforms.progress.value = animationProgress;
    }
  });

  return (
    <group>
      <mesh ref={content}>
        <planeGeometry
          args={[10, 10 * (dimensions.height / dimensions.width)]}
        />
        <primitive object={contentShaderMaterial} attach="material" />
      </mesh>
      <points ref={particles}>
        <bufferGeometry />
        <primitive object={particleShaderMaterial} attach="material" />
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

  const [contentDimensions, setContentDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setContentDimensions({ width, height });
    }
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={contentRef}
        className={className}
        style={{
          visibility: startAnimation ? 'hidden' : 'visible',
          color: 'white',
          ...style,
        }}
      >
        {children}
      </div>
      {texture && (
        // NOTE: linear: https://github.com/pmndrs/react-three-fiber/discussions/1290#discussioncomment-668649
        <Canvas
          linear
          // origin camera config
          // camera={{ position: [0, 0, 10], fov: 60 }}
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{
            width: contentDimensions.width,
            height: contentDimensions.height * 2,
          }}
        >
          <color attach="background" args={['#000000']} />
          <OrbitControls enableRotate={false} />
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
            <ParticleSystem texture={texture} dimensions={contentDimensions} />
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
