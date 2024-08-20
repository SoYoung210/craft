import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const ParticleText = () => {
  const points = useRef<THREE.Points>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const textRef = useRef<THREE.Mesh>(null);

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
          vec3 pos = mix(initialPosition, targetPosition, progress);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 4.0;
          vOpacity = 1.0 - progress;
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

  const generateParticles = () => {
    if (!textRef.current || !points.current) return;

    const geometry = textRef.current.geometry;
    geometry.computeBoundingBox();

    const positions = [];
    const initialPositions = [];
    const targetPositions = [];

    const boundingBox = geometry.boundingBox!;
    const scale = 0.05;

    const gridSize = 100;
    const stepX = (boundingBox.max.x - boundingBox.min.x) / gridSize;
    const stepY = (boundingBox.max.y - boundingBox.min.y) / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const x = boundingBox.min.x + i * stepX;
        const y = boundingBox.min.y + j * stepY;
        const z = 0;

        if (geometry.boundingBox!.containsPoint(new THREE.Vector3(x, y, z))) {
          const scaledX = x * scale;
          const scaledY = y * scale;
          const scaledZ = z * scale;

          positions.push(scaledX, scaledY, scaledZ);
          initialPositions.push(scaledX, scaledY, scaledZ);
          targetPositions.push(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          );
        }
      }
    }

    const particleGeometry = points.current.geometry;
    const itemSize = 3;
    const particleCount = positions.length / itemSize;

    particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, itemSize)
    );
    particleGeometry.setAttribute(
      'initialPosition',
      new THREE.Float32BufferAttribute(initialPositions, itemSize)
    );
    particleGeometry.setAttribute(
      'targetPosition',
      new THREE.Float32BufferAttribute(targetPositions, itemSize)
    );

    particleGeometry.setDrawRange(0, particleCount);
  };

  useEffect(() => {
    if (startAnimation) {
      generateParticles();

      const animationDuration = 2000; // 2 seconds
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
    }
  }, [startAnimation]);

  useFrame(() => {
    if (points.current && 'uniforms' in points.current.material) {
      (
        points.current.material as THREE.ShaderMaterial
      ).uniforms.progress.value = animationProgress;
    }
  });

  const handleClick = () => {
    setStartAnimation(true);
  };

  return (
    <group>
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={!startAnimation}
      >
        Hello
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        visible={!startAnimation}
      >
        Click me!
      </Text>
      <points ref={points} visible={startAnimation}>
        <bufferGeometry />
        <primitive object={shaderMaterial} attach="material" />
      </points>
    </group>
  );
};

export const ParticleEffect = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <color attach="background" args={['#202020']} />
      <OrbitControls />
      <ParticleText />
    </Canvas>
  );
};
