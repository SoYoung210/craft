import { useFBO } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import simVertex from './shaders/simVertex.glsl';
import simFragment from './shaders/simFrag.glsl';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertexParticles.glsl';

export function Particle2() {
  const size = 256;
  const { gl, camera } = useThree();

  // Create FBOs for ping-pong rendering
  const fbo1 = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const fbo2 = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  // Initialize position and info data
  const { positionTexture, infoTexture } = useMemo(() => {
    // Position data - initial positions in a circular pattern
    const posData = new Float32Array(size * size * 4);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i + j * size) * 4;
        const theta = Math.random() * Math.PI * 2;
        const r = 0.5 + 0.5 * Math.random();
        // const r = 0.8 + 0.2 * Math.random();
        posData[index + 0] = r * Math.cos(theta);
        posData[index + 1] = r * Math.sin(theta);
        posData[index + 2] = 1.0;
        posData[index + 3] = 1.0;
      }
    }

    const posTexture = new THREE.DataTexture(
      posData,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    posTexture.magFilter = THREE.NearestFilter;
    posTexture.minFilter = THREE.NearestFilter;
    posTexture.needsUpdate = true;

    // Info data - store original radius for each particle
    const infoData = new Float32Array(size * size * 4);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i + j * size) * 4;

        infoData[index + 0] = 0.5 + Math.random();
        infoData[index + 1] = 0.5 + Math.random();
        infoData[index + 2] = 1.0;
        infoData[index + 3] = 1.0;
      }
    }

    const infoTex = new THREE.DataTexture(
      infoData,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    infoTex.magFilter = THREE.NearestFilter;
    infoTex.minFilter = THREE.NearestFilter;
    infoTex.needsUpdate = true;

    return { positionTexture: posTexture, infoTexture: infoTex };
  }, [size]);

  // Simulation scene, camera, and mesh for FBO rendering
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1),
    []
  );
  const simMesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPositions: { value: positionTexture },
        uInfo: { value: infoTexture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        time: { value: 0 },
      },
      vertexShader: simVertex,
      fragmentShader: simFragment,
    });
    return new THREE.Mesh(geometry, material);
  }, [positionTexture, infoTexture]);

  useEffect(() => {
    simScene.add(simMesh);
    return () => {
      simScene.remove(simMesh);
    };
  }, [simScene, simMesh]);

  // Particle geometry with UV coordinates
  const particleGeometry = useMemo(() => {
    const count = size * size;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i + j * size;
        // Position: where the particle is in 3D space (XYZ)
        positions[index * 3 + 0] = Math.random();
        positions[index * 3 + 1] = Math.random();
        positions[index * 3 + 2] = 0;
        // UV: which pixel in the texture this particle reads from
        uvs[index * 2 + 0] = i / size; // uv[0] =
        uvs[index * 2 + 1] = j / size;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geometry;
  }, [size]);

  // Render material for particles
  const renderMaterial = useRef<THREE.ShaderMaterial>(null);

  // Mouse position
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dummyPlane = useMemo(
    () => new THREE.Mesh(new THREE.PlaneGeometry(100, 100)),
    []
  );

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      const pointer = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(dummyPlane);

      if (intersects.length > 0) {
        const { x, y } = intersects[0].point;
        mouseRef.current.set(x, y);
      }
    };

    document.addEventListener('pointermove', handleMouseMove);
    return () => document.removeEventListener('pointermove', handleMouseMove);
  }, [camera, raycaster, dummyPlane]);

  // Initialize FBOs with initial data
  useEffect(() => {
    const material = simMesh.material as THREE.ShaderMaterial;
    material.uniforms.uPositions.value = positionTexture;

    // Render to both FBOs initially
    gl.setRenderTarget(fbo1);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(fbo2);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);
  }, [gl, simScene, simCamera, simMesh, fbo1, fbo2, positionTexture]);

  // Ping-pong rendering
  const currentFBO = useRef(fbo1);
  const previousFBO = useRef(fbo2);

  useFrame(({ clock }) => {
    if (!renderMaterial.current) return;

    const time = clock.getElapsedTime();
    const simMat = simMesh.material as THREE.ShaderMaterial;

    // Update simulation uniforms
    simMat.uniforms.time.value = time;
    simMat.uniforms.uMouse.value = mouseRef.current;
    simMat.uniforms.uPositions.value = previousFBO.current.texture;

    // Render simulation to current FBO
    gl.setRenderTarget(currentFBO.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    // Update render material with new positions
    renderMaterial.current.uniforms.uPositions.value =
      currentFBO.current.texture;
    renderMaterial.current.uniforms.time.value = time;
    renderMaterial.current.uniforms.uInfo.value = infoTexture;

    // Swap FBOs for next frame
    const temp = currentFBO.current;
    currentFBO.current = previousFBO.current;
    previousFBO.current = temp;
  });

  return (
    <points geometry={particleGeometry}>
      <shaderMaterial
        ref={renderMaterial}
        side={THREE.DoubleSide}
        uniforms={{
          time: { value: 0 },
          resolution: { value: new THREE.Vector4() },
          uPositions: { value: positionTexture },
          uInfo: { value: infoTexture },
        }}
        vertexShader={vertex}
        fragmentShader={fragment}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
