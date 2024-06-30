import { motion } from 'framer-motion';
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';

import { SIZE } from './constants';

export function Shadow(props: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <div
      style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
      }}
    >
      <motion.div
        {...props}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: 999,
          boxShadow: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`,
          ...props.style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: SIZE + 8,
            height: SIZE + 8,
            borderRadius: 999,
            background: 'rgb(250,250,250)',
          }}
        />
      </motion.div>
    </div>
  );
}

export function InnerCircle() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 140,
        height: 140,
        borderRadius: 999,
        background: 'rgb(250,250,250)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: 'inherit',
          border: '3px solid #fff',
        }}
      />
    </div>
  );
}

interface LinePathProps {
  initialPos: { x: number; y: number };
}
export function LinePath(props: LinePathProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { initialPos } = props;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = useCallback(e => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const pathD =
    mousePos.x !== 0
      ? `M ${initialPos.x},${initialPos.y} L ${mousePos.x},${mousePos.y}`
      : '';

  return (
    <svg
      onMouseMove={handleMouseMove}
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <path
        d={pathD}
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          stroke: 'rgba(0, 0, 0, 0.05)',
        }}
      />
    </svg>
  );
}
