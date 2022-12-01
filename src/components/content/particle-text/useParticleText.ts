import { useCallback, useEffect, useRef, useState } from 'react';

import { random } from '../../../utils/number';

import { EffectDirectionType, Particle } from './particle';

interface InitParticlesParams {
  defaultText?: string;
  font?: (canvasWidth: number, canvasHeight: number) => string;
  globalCompositeOperation?: GlobalCompositeOperation;
  particleSize?: (canvasWidth: number, canvasHeight: number) => number;
  colorSet?: string[];
  effectDirection: EffectDirectionType;
}

const defaultColors = ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800'];

export default function useParticleText(params: InitParticlesParams) {
  const {
    defaultText,
    font,
    particleSize,
    colorSet = defaultColors,
    effectDirection,
    globalCompositeOperation = 'screen',
  } = params;

  const [text, setText] = useState(defaultText);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rAfRef = useRef<number>(-1);

  const particleRef = useRef<Particle[]>([]);

  const init = useCallback(
    (value: string) => {
      const canvasElement = canvasRef.current;
      const context = canvasElement?.getContext('2d');
      const particles = [];

      if (canvasElement == null || context == null) {
        return;
      }

      // to ref
      const { width, height } = canvasElement.getBoundingClientRect();

      const vw = width;
      const vh = height;
      canvasElement.width = width;
      canvasElement.height = height;

      context.clearRect(0, 0, vw, vh);
      context.font = font?.(vw, vh) ?? `bold ${vw / 10}px sans-serif`;
      context.textAlign = 'center';

      context.fillText(value, vw / 2, vh / 2);

      const imageData = context.getImageData(0, 0, vw, vh).data;
      context.clearRect(0, 0, vw, vh);
      context.globalCompositeOperation = globalCompositeOperation;

      const size = particleSize?.(vw, vh) ?? Math.round(vw / 150);

      for (let i = 0; i < vw; i += size) {
        for (let j = 0; j < vh; j += size) {
          const index = (i + j * vw) * 4;
          const alphaValue = imageData[index + 3];

          // 150: pixel alpha value threshold
          if (alphaValue > 150) {
            particles.push(
              new Particle(
                { x: i, y: j, effectDirection },
                { width: vw, height: vh },
                colorSet[random(0, colorSet.length - 1)]
              )
            );
          }
        }
      }
      particleRef.current = particles;
    },
    [colorSet, effectDirection, font, globalCompositeOperation, particleSize]
  );

  const runEffect = useCallback(
    (particles: Particle[]) => () => {
      const canvasElement = canvasRef.current;
      const context = canvasElement?.getContext('2d');

      if (canvasElement == null || context == null) {
        return;
      }

      const renderParticle = runEffect(particles);

      // to ref
      const { width, height } = canvasElement.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      particles?.forEach(particle => {
        particle.randomDirectionEffect(context);
      });
      rAfRef.current = requestAnimationFrame(renderParticle);
    },
    []
  );

  const start = useCallback(() => {
    if (particleRef.current.length !== 0) {
      const renderParticle = runEffect(particleRef.current);

      rAfRef.current = requestAnimationFrame(renderParticle);
      return () => {
        cancelAnimationFrame(rAfRef.current);
      };
    }
  }, [runEffect]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rAfRef.current);
  }, []);

  useEffect(() => {
    if (text != null) {
      init(text);
    }
  }, [init, text]);

  return [canvasRef, { init, start, stop, setText }] as const;
}
