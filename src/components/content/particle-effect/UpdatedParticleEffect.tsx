import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  ComponentPropsWithoutRef,
  forwardRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import html2canvas from 'html2canvas';
import { Primitive } from '@radix-ui/react-primitive';
import { composeEventHandlers } from '@radix-ui/primitive';

import { createContext } from '../../utility/createContext';

import { DATA_ATTRIBUTES, eventNames, selectors } from './utils';

interface ParticleEffectContextValue {
  triggerEffect: (id: string, element: HTMLElement) => void;
  getItemState: (id: string) => { isAnimating: boolean };
}

const [ParticleEffectProvider, useParticleEffectContext] =
  createContext<ParticleEffectContextValue>('ParticleEffectContext');

interface ParticleItemContextValue {
  id: string | undefined;
}

const [ParticleItemProvider, useParticleItemContext] =
  createContext<ParticleItemContextValue>('ParticleItemContext', {
    id: undefined,
  });

interface ParticleItem {
  texture: THREE.Texture | null;
  dimensions: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  isAnimating: boolean;
}

export const ParticleEffectRoot: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [items, setItems] = useState<Map<string, ParticleItem>>(new Map());
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const contextValue = useMemo(
    () => ({
      triggerEffect: async (id: string, element: HTMLElement) => {
        if (!element || itemsRef.current.get(id)?.isAnimating) return;

        try {
          const canvas = await html2canvas(element, {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            allowTaint: true,
            ignoreElements: elem => elem.tagName === 'CANVAS',
          });

          const texture = new THREE.CanvasTexture(canvas);
          const rect = element.getBoundingClientRect();

          setItems(prev => {
            const newMap = new Map(prev);
            const existingItem = newMap.get(id);
            if (existingItem?.texture) {
              existingItem.texture.dispose();
            }
            newMap.set(id, {
              texture,
              dimensions: {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
              },
              isAnimating: true,
            });
            return newMap;
          });

          window.dispatchEvent(new CustomEvent(eventNames.particleStart(id)));
        } catch (error) {
          console.error('Failed to create particle effect:', error);
        }
      },
      getItemState: (id: string) => {
        const item = itemsRef.current.get(id);
        return {
          isAnimating: item?.isAnimating || false,
        };
      },
    }),
    []
  );

  useEffect(() => {
    const cleanup = (id: string) => {
      setTimeout(() => {
        setItems(prev => {
          const newMap = new Map(prev);
          const item = newMap.get(id);
          if (item?.texture) {
            item.texture.dispose();
          }
          newMap.delete(id);
          return newMap;
        });
      }, 2400);
    };

    items.forEach((_, id) => {
      if (items.get(id)?.isAnimating) {
        cleanup(id);
      }
    });
  }, [items]);

  return (
    <ParticleEffectProvider {...contextValue}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
      >
        <Canvas
          linear
          orthographic
          camera={{ zoom: 1, position: [0, 0, 100] }}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            depth: true,
            logarithmicDepthBuffer: true,
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {Array.from(items.entries()).map(([id, item], index) => {
            const zOffset = (index + 1) * -0.3;
            if (item.texture == null) {
              return;
            }
            return (
              <ParticleSystem
                key={`${id}-particles`}
                texture={item.texture}
                dimensions={item.dimensions}
                zOffset={zOffset}
              />
            );
          })}
        </Canvas>
      </div>
    </ParticleEffectProvider>
  );
};

interface ItemProps {
  children: React.ReactNode;
  id: string;
  onExitComplete?: () => void;
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ children, id, onExitComplete, ...restProps }, ref) => {
    const [shouldExit, setShouldExit] = useState(false);

    useEffect(() => {
      const handleAnimationStart = () => {
        setShouldExit(true);
      };

      const eventName = eventNames.particleStart(id);
      window.addEventListener(eventName, handleAnimationStart);

      return () => {
        window.removeEventListener(eventName, handleAnimationStart);
      };
    }, [id]);

    return (
      <ParticleItemProvider id={id}>
        <AnimatePresence onExitComplete={onExitComplete}>
          {!shouldExit ? (
            <motion.div
              ref={ref}
              layout
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                ease: [0.22, 1, 0.36, 1],
                duration: 1.2,
                opacity: { duration: 0.4 },
              }}
              {...{ [DATA_ATTRIBUTES.ITEM_ID]: id }}
              {...restProps}
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ParticleItemProvider>
    );
  }
);

interface ParticleSystemProps {
  texture: THREE.Texture;
  dimensions: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  zOffset: number;
}
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
    u_ZOffset: 0.0,
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
    uniform float u_ZOffset;

    attribute float a_ParticleIndex;

    varying vec2 v_ParticleCoord;
    varying float v_ParticleLifetime;

    float random(float v) {
        return fract(sin(v) * 100000.0);
    }

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(13.0,78.2))) * 43758.5);
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

        float xOffset = 0.8;

        // If the u_ViewportWidth is smaller than 632, should be adjusted like this
        float baseHeight = 1184.0; // magic number (...)
        float heightRatio = u_ViewportHeight / baseHeight;

        float xSpread = 0.3 * heightRatio;
        float ySpread = 0.125 * heightRatio;

        float x = interpolateLinear(
            normalizedX,
            normalizedX + xOffset + (random(normalizedX, r) - 0.3),
            factor * 0.4
        );
        float y = interpolateLinear(
            normalizedY,
            normalizedY + (random(normalizedY, r) - ySpread),
            factor * 0.2 * (baseHeight / u_ViewportHeight)
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
        gl_Position = vec4(blownPosition, u_ZOffset, 1.0);
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
const duration = 2000;
const ParticleSystem: React.FC<ParticleSystemProps> = ({
  texture,
  dimensions,
  zOffset,
}) => {
  const mesh = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const [particleSize, setParticleSize] = useState(0.5);

  const { size } = useThree();

  useEffect(() => {
    const dpr = window.devicePixelRatio;
    setParticleSize(-0.5 * dpr + 1.5);
  }, []);

  useEffect(() => {
    const rect = dimensions;
    const textureWidth = Math.round(rect.width / particleSize);
    const textureHeight = Math.round(rect.height / particleSize);

    if (material.current) {
      material.current.uniforms.u_Texture.value = texture;
      material.current.uniforms.u_AnimationDuration.value = duration;
      material.current.uniforms.u_ParticleSize.value = particleSize;
      material.current.uniforms.u_ViewportHeight.value = size.height;
      material.current.uniforms.u_ViewportWidth.value = size.width;
      material.current.uniforms.u_TextureWidth.value = textureWidth;
      material.current.uniforms.u_TextureHeight.value = textureHeight;
      material.current.uniforms.u_TextureLeft.value = rect.left;
      material.current.uniforms.u_TextureTop.value = rect.top;
      material.current.uniforms.u_ZOffset.value = zOffset;
    }
  }, [size, dimensions, texture, zOffset, particleSize]);

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
  }, [dimensions.width, dimensions.height, particleSize]);

  useEffect(() => {
    const animationDuration = duration;
    const startTime = Date.now();

    const animateParticles = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(1, elapsedTime / animationDuration);
      if (elapsedTime > animationDuration) {
        return;
      }

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
        depthWrite={true}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};
interface TriggerProps
  extends ComponentPropsWithoutRef<typeof Primitive.button> {
  targetId?: string;
  hideAfterTrigger?: boolean;
}

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  (
    { targetId, children, onClick, hideAfterTrigger = true, ...restProps },
    ref
  ) => {
    const context = useParticleEffectContext('ParticleEffect.Trigger');
    const { id: itemId } = useParticleItemContext('ParticleEffect.Trigger');
    const id = targetId ?? itemId ?? '';
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const handleAnimationStart = () => {
        if (hideAfterTrigger) {
          setIsVisible(false);
        }
      };

      const eventName = `particle-effect-start-${id}`;
      window.addEventListener(eventName, handleAnimationStart);

      return () => {
        window.removeEventListener(eventName, handleAnimationStart);
      };
    }, [hideAfterTrigger, id]);

    if (!isVisible) {
      return null;
    }

    const handleClick = () => {
      const element = document.querySelector(
        selectors.getItemById(id)
      ) as HTMLElement;

      if (element) {
        context?.triggerEffect(id, element);
      }
    };

    return (
      <Primitive.button
        ref={ref}
        onClick={composeEventHandlers(onClick, handleClick)}
        {...restProps}
      >
        {children}
      </Primitive.button>
    );
  }
);

export const ParticleEffect = {
  Root: ParticleEffectRoot,
  Item,
  Trigger,
};
