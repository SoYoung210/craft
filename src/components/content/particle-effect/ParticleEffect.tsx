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
          gl_PointSize = mix(2.0, 0.5, progress);
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

    const particleCount = 5000;
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);

    const boundingBox = geometry.boundingBox!;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const tempPosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < particleCount; i++) {
      // Sample a random point within the bounding box
      tempPosition.set(
        THREE.MathUtils.randFloat(boundingBox.min.x, boundingBox.max.x),
        THREE.MathUtils.randFloat(boundingBox.min.y, boundingBox.max.y),
        boundingBox.min.z
      );

      // Check if the point is inside the text
      raycaster.set(tempPosition, direction);
      const intersects = raycaster.intersectObject(textRef.current);

      if (intersects.length % 2 === 1) {
        // Point is inside the text
        initialPositions[i * 3] = tempPosition.x;
        initialPositions[i * 3 + 1] = tempPosition.y;
        initialPositions[i * 3 + 2] = tempPosition.z;

        // Calculate target position
        const directionVector = new THREE.Vector3(
          tempPosition.x - center.x,
          tempPosition.y - center.y,
          tempPosition.z - center.z
        ).normalize();

        const distance = 5 + Math.random() * 5; // Scatter between 5 and 10 units

        targetPositions[i * 3] = tempPosition.x + directionVector.x * distance;
        targetPositions[i * 3 + 1] =
          tempPosition.y + directionVector.y * distance;
        targetPositions[i * 3 + 2] =
          tempPosition.z + directionVector.z * distance;
      } else {
        // Point is outside the text, try again
        i--;
      }
    }

    const particleGeometry = points.current.geometry;

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(initialPositions, 3)
    );
    particleGeometry.setAttribute(
      'initialPosition',
      new THREE.BufferAttribute(initialPositions, 3)
    );
    particleGeometry.setAttribute(
      'targetPosition',
      new THREE.BufferAttribute(targetPositions, 3)
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
