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

  const generateParticles = () => {
    if (!textRef.current || !points.current) return;

    const geometry = textRef.current.geometry;
    geometry.computeBoundingBox();

    const particleCount = 5000;
    const initialPositions = [];
    const targetPositions = [];

    const boundingBox = geometry.boundingBox!;

    // Create a canvas to draw the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    if (!context) return;

    context.fillStyle = 'white';
    context.font = 'bold 200px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Hello', canvas.width / 2, canvas.height / 2);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < particleCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
      } while (pixels[(y * canvas.width + x) * 4] === 0);

      const xPos = (x / canvas.width - 0.5) * boundingBox.max.x * 2;
      const yPos = (0.5 - y / canvas.height) * boundingBox.max.y * 2;

      initialPositions.push(xPos, yPos, 0);

      // Generate random direction for each particle
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      // Base distance
      let distance = 2 + Math.random() * 3; // Scatter between 2 and 5 units

      // Adjust distance based on direction
      const upwardBias = Math.max(0, Math.cos(phi)); // 1 when moving straight up, 0 when moving horizontally
      distance *= 1 + upwardBias; // Increase distance for upward motion

      const targetX = xPos + distance * Math.sin(phi) * Math.cos(theta);
      const targetY = yPos + distance * Math.cos(phi);
      const targetZ = distance * Math.sin(phi) * Math.sin(theta);

      targetPositions.push(targetX, targetY, targetZ);
    }

    const particleGeometry = points.current.geometry;

    particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(initialPositions, 3)
    );
    particleGeometry.setAttribute(
      'initialPosition',
      new THREE.Float32BufferAttribute(initialPositions, 3)
    );
    particleGeometry.setAttribute(
      'targetPosition',
      new THREE.Float32BufferAttribute(targetPositions, 3)
    );

    particleGeometry.setDrawRange(0, particleCount);
  };

  useEffect(() => {
    if (startAnimation) {
      generateParticles();

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
        // font="/path/to/your/font.ttf" // Specify a font that supports high detail
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
    <div style={{ width: '100%', height: 500 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <OrbitControls />
        <ParticleText />
      </Canvas>
    </div>
  );
};
