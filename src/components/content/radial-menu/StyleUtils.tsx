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
import { Position } from './types';

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
const LASSO_ANGLE_CSS_VAR = '--lassoAngle';
export function LinePath(props: LinePathProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { initialPos } = props;
  const [mousePos, setMousePos] = useState({ x: 600, y: 600 });
  const lassoRef = useRef<SVGPathElement>(null);
  const mouseCursorRef = useRef<SVGSVGElement>(null);

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = useCallback(
    e => {
      const x = e.clientX;
      const y = e.clientY;

      // const x = 240;
      // const y = 148;
      const angle = getAngleBetweenPositions(initialPos, {
        x,
        y,
      });
      console.log(
        'x,y',
        x,
        y,
        angle,
        '[보정값]: ',
        calculateCursorTranslateX(angle),
        calculateCursorTranslateY(angle)
      );
      const lassoAngle = (93 / 90) * angle - 289;

      if (svgRef.current != null) {
        svgRef.current.style.setProperty(
          LASSO_ANGLE_CSS_VAR,
          `${lassoAngle}deg`
        );
      }
      if (lassoRef.current != null) {
        lassoRef.current.style.transform = `rotate(${lassoAngle}deg) translate(${calculateLassoTranslateX(
          angle
        )}px, ${calculateLassoTranslateY(angle)}px)`;
      }

      setMousePos({ x, y });
    },
    [initialPos]
  );

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
        }}
      />
      {/* Grabbing Cursor */}
      <svg
        ref={mouseCursorRef}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        x={
          mousePos.x +
          calculateCursorTranslateX(
            getAngleBetweenPositions(initialPos, mousePos)
          )
        }
        y={
          mousePos.y +
          calculateCursorTranslateY(
            getAngleBetweenPositions(initialPos, mousePos)
          )
        }
      >
        <g
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: `rotate(calc(var(${LASSO_ANGLE_CSS_VAR}, 0deg) + 180deg))`,
          }}
        >
          <path
            d="M8.00003 7.14995C8.48003 6.96995 9.43003 7.07995 9.68003 7.61995C9.93003 8.15995 10.08 8.85995 10.09 8.68995C10.0709 8.17325 10.1145 7.65613 10.22 7.14995C10.3312 6.82577 10.5858 6.5711 10.91 6.45995C11.2073 6.36592 11.523 6.34533 11.83 6.39995C12.1404 6.46385 12.4154 6.64238 12.6 6.89995C12.834 7.48308 12.9659 8.1021 12.99 8.72995C13.0149 8.19421 13.1056 7.66355 13.26 7.14995C13.4271 6.9145 13.6712 6.74474 13.95 6.66995C14.2806 6.60951 14.6194 6.60951 14.95 6.66995C15.2214 6.76001 15.4587 6.93101 15.63 7.15995C15.8424 7.6901 15.9706 8.2502 16.01 8.81995C16.01 8.95995 16.08 8.42995 16.3 8.07995C16.4768 7.55528 17.0454 7.27322 17.57 7.44995C18.0947 7.62668 18.3768 8.19528 18.2 8.71995C18.2 9.36995 18.2 9.33995 18.2 9.77995C18.2 10.22 18.2 10.61 18.2 10.98C18.164 11.5652 18.0838 12.1468 17.96 12.72C17.7865 13.2273 17.5442 13.7084 17.24 14.15C16.7546 14.69 16.3534 15.3002 16.05 15.96C15.976 16.288 15.9424 16.6238 15.95 16.96C15.949 17.2706 15.9894 17.58 16.07 17.88C15.6612 17.9236 15.2489 17.9236 14.84 17.88C14.45 17.82 13.97 17.04 13.84 16.8C13.7757 16.6711 13.6441 16.5897 13.5 16.5897C13.356 16.5897 13.2243 16.6711 13.16 16.8C12.94 17.18 12.45 17.87 12.16 17.91C11.49 17.99 10.1 17.91 9.02003 17.91C9.02003 17.91 9.21003 16.91 8.79003 16.55C8.37003 16.19 7.96003 15.77 7.65003 15.49L6.82003 14.57C6.23472 14.0266 5.80641 13.3358 5.58003 12.57C5.37003 11.63 5.39003 11.18 5.58003 10.8C5.77381 10.4862 6.07642 10.2548 6.43003 10.15C6.7238 10.0967 7.02621 10.1173 7.31003 10.21C7.50629 10.2921 7.67592 10.4271 7.80003 10.6C8.03003 10.91 8.11003 11.06 8.01003 10.72C7.91003 10.38 7.69003 10.13 7.58003 9.71995C7.36588 9.23575 7.23731 8.71808 7.20003 8.18995C7.24101 7.71612 7.57185 7.31751 8.03003 7.18995"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.00003 7.14995C8.48003 6.96995 9.43003 7.07995 9.68003 7.61995C9.93003 8.15995 10.08 8.85995 10.09 8.68995C10.0709 8.17325 10.1145 7.65613 10.22 7.14995C10.3312 6.82577 10.5858 6.5711 10.91 6.45995C11.2073 6.36592 11.523 6.34533 11.83 6.39995C12.1404 6.46385 12.4154 6.64238 12.6 6.89995C12.834 7.48308 12.9659 8.1021 12.99 8.72995C13.0149 8.19421 13.1056 7.66355 13.26 7.14995C13.4271 6.9145 13.6712 6.74474 13.95 6.66995C14.2806 6.60951 14.6194 6.60951 14.95 6.66995C15.2214 6.76001 15.4587 6.93101 15.63 7.15995C15.8424 7.6901 15.9706 8.2502 16.01 8.81995C16.01 8.95995 16.08 8.42995 16.3 8.07995C16.4768 7.55528 17.0454 7.27322 17.57 7.44995C18.0947 7.62668 18.3768 8.19528 18.2 8.71995C18.2 9.36995 18.2 9.33995 18.2 9.77995C18.2 10.22 18.2 10.61 18.2 10.98C18.164 11.5652 18.0838 12.1468 17.96 12.72C17.7865 13.2273 17.5442 13.7084 17.24 14.15C16.7546 14.69 16.3534 15.3002 16.05 15.96C15.976 16.288 15.9424 16.6238 15.95 16.96C15.949 17.2706 15.9894 17.58 16.07 17.88C15.6612 17.9236 15.2489 17.9236 14.84 17.88C14.45 17.82 13.97 17.04 13.84 16.8C13.7757 16.6711 13.6441 16.5897 13.5 16.5897C13.356 16.5897 13.2243 16.6711 13.16 16.8C12.94 17.18 12.45 17.87 12.16 17.91C11.49 17.99 10.1 17.91 9.02003 17.91C9.02003 17.91 9.21003 16.91 8.79003 16.55C8.37003 16.19 7.96003 15.77 7.65003 15.49L6.82003 14.57C6.23472 14.0266 5.80641 13.3358 5.58003 12.57C5.37003 11.63 5.39003 11.18 5.58003 10.8C5.77381 10.4862 6.07642 10.2548 6.43003 10.15C6.7238 10.0967 7.02621 10.1173 7.31003 10.21C7.50629 10.2921 7.67592 10.4271 7.80003 10.6C8.03003 10.91 8.11003 11.06 8.01003 10.72C7.91003 10.38 7.69003 10.13 7.58003 9.71995C7.36588 9.23575 7.23731 8.71808 7.20003 8.18995C7.22047 7.70919 7.54059 7.29303 8.00003 7.14995Z"
            stroke="#202125"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
          <path
            d="M15.75 14.8259V11.3741C15.75 11.1675 15.5821 11 15.375 11C15.1679 11 15 11.1675 15 11.3741V14.8259C15 15.0325 15.1679 15.2 15.375 15.2C15.5821 15.2 15.75 15.0325 15.75 14.8259Z"
            fill="#202125"
          />
          <path
            d="M13.77 14.8246L13.75 11.3711C13.7488 11.165 13.5799 10.9988 13.3728 11C13.1657 11.0012 12.9988 11.1693 13 11.3754L13.02 14.8289C13.0212 15.0351 13.1901 15.2012 13.3972 15.2C13.6043 15.1988 13.7712 15.0307 13.77 14.8246Z"
            fill="#202125"
          />
          <path
            d="M11 11.3799L11.02 14.8245C11.0212 15.0331 11.1901 15.2012 11.3972 15.2C11.6043 15.1988 11.7712 15.0287 11.77 14.8201L11.75 11.3755C11.7488 11.1669 11.5799 10.9988 11.3728 11C11.1657 11.0012 10.9988 11.1713 11 11.3799Z"
            fill="#202125"
          />
        </g>
      </svg>
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

const generateLassoPath = (position: Position, scale = 2) => {
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

function calculateCursorTranslateX(angle: number) {
  if (angle >= 0 && angle <= 60) {
    return 12 - ((angle - 0) / 60) * 3; // 12 to 9
  } else if (angle > 60 && angle <= 90) {
    return 9 - ((angle - 60) / 30) * 9; // 9 to 0
  } else if (angle > 90 && angle <= 105) {
    return 0 - ((angle - 90) / 15) * 9; // 0 to -9
  } else if (angle > 105 && angle <= 168) {
    return -9 - ((angle - 105) / 63) * 24; // -9 to -33
  } else if (angle > 168 && angle <= 198) {
    return -33 - ((angle - 168) / 30) * 4; // -33 to -37
  } else if (angle > 198 && angle <= 234) {
    return -37 + ((angle - 198) / 36) * 3; // -37 to -34
  } else if (angle > 234 && angle <= 270) {
    return -34 + ((angle - 234) / 36) * 10; // -34 to -24
  } else if (angle > 270 && angle <= 320) {
    return -24 + ((angle - 270) / 50) * 24; // -24 to 0
  } else if (angle > 320 && angle <= 322) {
    return 0 + ((angle - 320) / 2) * 2; // 0 to 2
  } else if (angle > 322 && angle <= 345) {
    return 2 + ((angle - 322) / 23) * 6; // 2 to 8
  } else if (angle > 345 && angle <= 360) {
    return 8 + ((angle - 345) / 15) * 4; // 8 to 12
  } else {
    return 0;
  }
}

function calculateCursorTranslateY(angle: number) {
  if (angle >= 0 && angle <= 60) {
    return -21 + ((angle - 0) / 60) * 21; // -21 to 0
  } else if (angle > 60 && angle <= 90) {
    return 0 + ((angle - 60) / 30) * 11; // 0 to 11
  } else if (angle > 90 && angle <= 105) {
    return 11 + ((angle - 90) / 15) * 1; // 11 to 12
  } else if (angle > 105 && angle <= 168) {
    return 12 - ((angle - 105) / 63) * 8; // 12 to 4
  } else if (angle > 168 && angle <= 198) {
    return 4 - ((angle - 168) / 30) * 15; // 4 to -11
  } else if (angle > 198 && angle <= 234) {
    return -11 - ((angle - 198) / 36) * 13; // -11 to -24
  } else if (angle > 234 && angle <= 270) {
    return -24 - ((angle - 234) / 36) * 4; // -24 to -28
  } else if (angle > 270 && angle <= 320) {
    return -28 - ((angle - 270) / 50) * 5; // -28 to -33
  } else if (angle > 320 && angle <= 322) {
    return -33; // Stays at -33 for this small range
  } else if (angle > 322 && angle <= 345) {
    return -33 + ((angle - 322) / 23) * 5; // -33 to -28
  } else if (angle > 345 && angle <= 360) {
    return -28 + ((angle - 345) / 15) * 7; // -28 to -21
  } else {
    return 0;
  }
}
