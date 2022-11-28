import { useCallback, useEffect, useRef } from 'react';

import PageLayout from '../components/layout/PageLayout';
import TextField from '../components/material/TextField';
import { random } from '../utils/number';

const sampleColors = ['#468966', '#FFF0A5', '#FFB03B', '#B64926', '#8E2800'];

export default function ParticleTextPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rAfRef = useRef<number>(-1);

  const initScreen = useCallback(() => {
    const canvasElement = canvasRef.current;
    const context = canvasElement?.getContext('2d');

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
    context.font = `bold ${vw / 10}px sans-serif`;
    context.textAlign = 'center';
    // FIXME:
    context.fillText('Hello World', vw / 2, vh / 2);

    const imageData = context.getImageData(0, 0, vw, vh).data;
    context.clearRect(0, 0, vw, vh);
    // TODO: ???? 약간 모르겠음.
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    context.globalCompositeOperation = 'screen';

    console.log('vw', vw);
    const particles = [];
    for (let i = 0; i < vw; i += Math.round(vw / 150)) {
      for (let j = 0; j < vh; j += Math.round(vw / 150)) {
        if (imageData[(i + j * vw) * 4 + 3] > 150) {
          particles.push(
            new Particle(
              { x: i, y: j },
              { width: vw, height: vh },
              sampleColors[random(0, sampleColors.length - 1)]
            )
          );
        }
      }
    }
    return particles;
  }, []);

  const render = useCallback(
    (particles: Particle[]) => () => {
      const canvasElement = canvasRef.current;
      const context = canvasElement?.getContext('2d');

      if (canvasElement == null || context == null) {
        return;
      }
      // console.log('particles', particles);
      const renderParticle = render(particles);

      // to ref
      const { width, height } = canvasElement.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      particles?.forEach(particle => {
        particle.render(context);
      });
      rAfRef.current = requestAnimationFrame(renderParticle);
    },
    []
  );

  useEffect(() => {
    const particles = initScreen();

    if (particles != null) {
      const renderParticle = render(particles);
      rAfRef.current = requestAnimationFrame(renderParticle);
      return () => {
        cancelAnimationFrame(rAfRef.current);
      };
    }
  }, [initScreen, render]);

  return (
    <PageLayout>
      <PageLayout.Title>Particle Text</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>canvas drawing</PageLayout.Summary>
      </PageLayout.Details>
      <canvas ref={canvasRef} />
      <TextField placeholder="type a text" />
    </PageLayout>
  );
}

class Particle {
  // destination: 최종적으로 파티클이 그려질 곳
  private destinationX: number;
  private destinationY: number;
  // 시작점
  private positionX: number;
  private positionY: number;
  // 원 크기
  // tuning
  private radius = Math.random() + 2;
  // 20: spread amount
  // 0.5: center moving
  private velocityX = (Math.random() - 0.5) * 10;
  private velocityY = (Math.random() - 0.5) * 10;
  private friction = Math.random() * 0.05 + 0.94;
  // private friction = 0.99;

  private accX = 0;
  private accY = 0;

  private color: string;

  constructor(
    particlePosition: { x: number; y: number },
    canvasSize: { width: number; height: number },
    color: string
  ) {
    const { x, y } = particlePosition;
    const { width, height } = canvasSize;
    this.destinationX = x;
    this.destinationY = y;
    this.positionX = Math.random() * width;
    this.positionY = Math.random() * height;
    this.color = color;
  }

  render(context: CanvasRenderingContext2D) {
    this.accX = (this.destinationX - this.positionX) / 1000;
    this.accY = (this.destinationY - this.positionY) / 1000;
    this.velocityX += this.accX;
    this.velocityY += this.accY;

    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}
