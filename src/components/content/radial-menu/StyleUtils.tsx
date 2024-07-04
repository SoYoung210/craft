import { motion } from 'framer-motion';
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';

import { getAngleBetweenPositions } from '../../../utils/math';

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
  const [mousePos, setMousePos] = useState({ x: 600, y: 600 });
  const lassoRef = useRef<SVGPathElement>(null);

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = useCallback(
    e => {
      const x = e.clientX;
      const y = e.clientY;

      const angle = getAngleBetweenPositions(initialPos, {
        x,
        y,
      });

      const lassoAngle = (93 / 90) * angle - 289;
      if (lassoRef.current != null) {
        lassoRef.current.style.transform = `rotate(${lassoAngle}deg) translate(${calculateLassoTranslateX(
          angle
        )}px, ${calculateLassoTranslateY(angle)}px)`;
      }

      setMousePos({ x, y });
    },
    [initialPos]
  );

  // 여기서 시도중

  const pathD =
    mousePos.x !== 0
      ? `M ${initialPos.x},${initialPos.y} L ${mousePos.x},${mousePos.y}`
      : '';
  const pathD2 = mousePos.x !== 0 ? `${pathD}` : '';
  const lassoPath =
    mousePos.x !== 0
      ? generateLassoPath({
          x: mousePos.x,
          y: mousePos.y,
        })
      : '';

  return (
    <svg
      onMouseMove={handleMouseMove}
      xmlns="http://www.w3.org/2000/svg"
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
        d={pathD2}
        stroke="rgba(0, 0, 0, 0.05)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={lassoPath}
        ref={lassoRef}
        strokeWidth="3"
        fill="none"
        stroke="rgba(0, 0, 0, 0.05)"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          // transform: `rotate(${lassoRotate}deg) translate(${lassoTranslateX}px, ${lassoTranslateY}px)`,
        }}
      />
    </svg>
  );
}

function calculateLassoTranslateY(angle: number) {
  if (angle >= 0 && angle <= 90) {
    return -21 + ((angle - 0) / 90) * 1; // -21에서 -20까지
  } else if (angle > 90 && angle <= 180) {
    return -20 + ((angle - 90) / 90) * 12; // -20에서 -8까지
  } else if (angle > 180 && angle <= 270) {
    return -8 + ((angle - 180) / 90) * 8; // -8에서 0까지
  } else if (angle > 270 && angle <= 325) {
    return 0 - ((angle - 270) / 55) * 16; // 0에서 -16까지
  } else if (angle > 325 && angle <= 360) {
    return -16 - ((angle - 325) / 35) * 5; // -16에서 -21까지
  } else {
    return 0;
  }
}

function calculateLassoTranslateX(angle: number) {
  if (angle >= 0 && angle <= 90) {
    return 2 - ((angle - 0) / 90) * 12; // 2에서 -10까지
  } else if (angle > 90 && angle <= 180) {
    return -10 - ((angle - 90) / 90) * 1; // -10에서 -11까지
  } else if (angle > 180 && angle <= 270) {
    return -11 + ((angle - 180) / 90) * 11; // -11에서 0까지
  } else if (angle > 270 && angle <= 325) {
    return 0 + ((angle - 270) / 55) * 3; // 0에서 3까지
  } else if (angle > 325 && angle <= 360) {
    return 3 - ((angle - 325) / 35) * 3; // 3에서 0까지
  } else {
    return 0;
  }
}

const generateLassoPath = (position: { x: number; y: number }, scale = 2) => {
  const { x, y } = position;
  return `M ${x} ${y}
          C ${x + 2 * scale} ${y - 1.1111 * scale} ${x + 2 * scale} ${
            y - 3.5 * scale
          } ${x + 2 * scale} ${y - 4.5 * scale}
          C ${x + 2 * scale} ${y - 5.5 * scale} ${x + 1.2873 * scale} ${
            y - 6.567 * scale
          } ${x} ${y - 7.5 * scale}
          C ${x - 1.3212 * scale} ${y - 8.4581 * scale} ${x - 4.231 * scale} ${
            y - 8.253 * scale
          } ${x - 5.4975 * scale} ${y - 8 * scale}
          C ${x - 8 * scale} ${y - 7.5 * scale} ${x - 10.33 * scale} ${
            y - 5 * scale
          } ${x - 10 * scale} ${y - 3 * scale}
          C ${x - 9.67 * scale} ${y - 1 * scale} ${x - 9.622 * scale} ${
            y - 0.54 * scale
          } ${x - 8.193 * scale} ${y + 0.372 * scale}
          C ${x - 7.427 * scale} ${y + 0.861 * scale} ${x - 5.804 * scale} ${
            y + 0.915 * scale
          } ${x - 4.503 * scale} ${y + 1 * scale}
          M ${x} ${y}
          C ${x - 2 * scale} ${y + 1.111 * scale} ${x - 3.591 * scale} ${
            y + 1.059 * scale
          } ${x - 4.5 * scale} ${y + 1 * scale}
          M ${x} ${y}
          C ${x - 0.471 * scale} ${y - 0.882 * scale} ${x - 1.5 * scale} ${
            y - 1.5 * scale
          } ${x - 2.5 * scale} ${y - 1.5 * scale}
          C ${x - 3.5 * scale} ${y - 1.5 * scale} ${x - 4.5 * scale} ${
            y - 0.5 * scale
          } ${x - 4.5 * scale} ${y + 1 * scale}
          M ${x} ${y}
          C ${x} ${y + 0.781 * scale} ${x} ${y + 1 * scale} ${x} ${
            y + 2 * scale
          }
          C ${x} ${y + 3 * scale} ${x - 1.5 * scale} ${y + 4 * scale} ${
            x - 1.5 * scale
          } ${y + 4 * scale}`;
};
