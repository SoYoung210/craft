// CarParticles.tsx / .jsx
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

import vertexShader from './shaders/carParticles.vert';
import fragmentShader from './shaders/carParticles.frag';

type CarParticlesProps = {
  count?: number;
};

export function CarParticles({ count = 80000 }: CarParticlesProps) {
  const { scene } = useGLTF('/models/f1-2025_redbull_rb21.glb');
  const pointsRef = useRef<THREE.Points>(null);

  // Build particle geometry once model is loaded
  const geom = useMemo(() => {
    if (!scene) return null;

    const allPositions: number[] = [];
    const allNormals: number[] = [];

    // Extract ALL vertices from ALL meshes for maximum detail
    scene.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        child.updateWorldMatrix(true, true);

        const geometry = child.geometry.clone();
        geometry.applyMatrix4(child.matrixWorld);

        if (geometry.attributes.position) {
          const positions = geometry.attributes.position;
          const normals = geometry.attributes.normal || positions; // Use positions as normals if no normals

          // Add every vertex
          for (let i = 0; i < positions.count; i++) {
            allPositions.push(
              positions.getX(i),
              positions.getY(i),
              positions.getZ(i)
            );

            // Use normals for explosion direction
            if (geometry.attributes.normal) {
              allNormals.push(
                normals.getX(i),
                normals.getY(i),
                normals.getZ(i)
              );
            } else {
              // Fallback: use position as direction
              const x = positions.getX(i);
              const y = positions.getY(i);
              const z = positions.getZ(i);
              const len = Math.sqrt(x * x + y * y + z * z) || 1;
              allNormals.push(x / len, y / len, z / len);
            }
          }

          // Also sample additional points along edges for better detail
          if (geometry.index) {
            const index = geometry.index;
            for (let i = 0; i < index.count; i += 3) {
              const a = index.getX(i);
              const b = index.getX(i + 1);
              const c = index.getX(i + 2);

              // Add midpoints of edges for denser coverage
              for (let t = 0.25; t < 1; t += 0.25) {
                // Edge AB
                const x1 =
                  positions.getX(a) +
                  (positions.getX(b) - positions.getX(a)) * t;
                const y1 =
                  positions.getY(a) +
                  (positions.getY(b) - positions.getY(a)) * t;
                const z1 =
                  positions.getZ(a) +
                  (positions.getZ(b) - positions.getZ(a)) * t;
                allPositions.push(x1, y1, z1);

                // Random normal for edge particles
                const rnd = new THREE.Vector3(
                  Math.random() - 0.5,
                  Math.random() - 0.5,
                  Math.random() - 0.5
                ).normalize();
                allNormals.push(rnd.x, rnd.y, rnd.z);
              }
            }
          }
        }
      }
    });

    if (allPositions.length === 0) return null;

    // Calculate bounds and center
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    for (let i = 0; i < allPositions.length; i += 3) {
      minX = Math.min(minX, allPositions[i]);
      maxX = Math.max(maxX, allPositions[i]);
      minY = Math.min(minY, allPositions[i + 1]);
      maxY = Math.max(maxY, allPositions[i + 1]);
      minZ = Math.min(minZ, allPositions[i + 2]);
      maxZ = Math.max(maxZ, allPositions[i + 2]);
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;

    console.log('Particle count:', allPositions.length / 3);
    console.log('Model size:', sizeX, sizeY, sizeZ);

    // Scale to fit view - the model is VERY small so we need massive scaling
    const scale = 200; // Direct scale factor since model is ~0.02 units

    // Create final particle arrays - use ALL vertices for maximum detail
    const particleCount = Math.min(allPositions.length / 3, count);
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount * 3);
    const delays = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    // Use all vertices if less than count, otherwise sample
    const step =
      allPositions.length / 3 > count
        ? Math.floor(allPositions.length / 3 / count)
        : 1;

    let idx = 0;
    for (
      let i = 0;
      i < allPositions.length && idx < particleCount;
      i += step * 3
    ) {
      // Apply scale and center
      positions[idx * 3] = (allPositions[i] - centerX) * scale;
      positions[idx * 3 + 1] = (allPositions[i + 1] - centerY) * scale;
      positions[idx * 3 + 2] = (allPositions[i + 2] - centerZ) * scale;

      // Use normals for explosion direction
      randoms[idx * 3] = allNormals[i];
      randoms[idx * 3 + 1] = allNormals[i + 1];
      randoms[idx * 3 + 2] = allNormals[i + 2];

      delays[idx] = Math.random();
      sizes[idx] = 0.5 + Math.random() * 0.3; // Consistent small size
      idx++;
    }

    const g2 = new THREE.BufferGeometry();
    g2.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g2.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    g2.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
    g2.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    return g2;
  }, [scene, count]);

  // uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: -1.0 }, // Start at -1 so particles are visible at rest
      uSize: { value: 1.2 * window.devicePixelRatio }, // Very small for maximum detail
    }),
    []
  );

  // Animate time & progress
  useFrame(state => {
    if (!pointsRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;

    // Automatic explosion is disabled - only triggered by click
  });

  // click to restart blow
  const handleClick = () => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uProgress.value = -1.0; // Reset to show car
  };

  if (!geom) return null;

  return (
    <group onClick={handleClick}>
      <points ref={pointsRef} geometry={geom}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

useGLTF.preload('/models/f1-2025_redbull_rb21.glb');
