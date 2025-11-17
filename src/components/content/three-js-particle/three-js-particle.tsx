// CarParticles.tsx / .jsx
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

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

    const geometries: THREE.BufferGeometry[] = [];
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.updateWorldMatrix(true, true);
        const g = child.geometry.clone();
        g.applyMatrix4(child.matrixWorld);

        // Ensure all geometries have position attribute only for merging
        const positions = g.attributes.position;
        if (positions) {
          const cleanGeom = new THREE.BufferGeometry();
          cleanGeom.setAttribute('position', positions);
          geometries.push(cleanGeom);
        }
      }
    });

    if (!geometries.length) return null;

    const merged = BufferGeometryUtils.mergeGeometries(geometries, false);

    if (!merged) return null;

    // Calculate bounding box to understand the model size
    merged.computeBoundingBox();
    const bbox = merged.boundingBox!;
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    console.log('Model center:', center);
    console.log('Model size:', size);
    console.log('Model vertices:', merged.attributes.position.count);

    // Scale up the model to make it visible (scale by 100x)
    const scaleFactor = 100;
    merged.scale(scaleFactor, scaleFactor, scaleFactor);

    // Center the model
    merged.computeBoundingBox();
    merged.boundingBox!.getCenter(center);
    merged.translate(-center.x, -center.y, -center.z);

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged))
      .setWeightAttribute(null)
      .build();

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    const delays = new Float32Array(count);
    const sizes = new Float32Array(count);

    const _pos = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      sampler.sample(_pos);
      positions.set([_pos.x, _pos.y, _pos.z], i * 3);

      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      randoms.set([dir.x, dir.y, dir.z], i * 3);

      delays[i] = Math.random(); // 0–1 delay
      sizes[i] = 0.5 + Math.random(); // particle size variation
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
      uSize: { value: 2.5 * window.devicePixelRatio }, // Smaller for denser look
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
