import { useId, forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface InfoIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const InfoIcon = forwardRef<SVGSVGElement, InfoIconProps>(
  (
    { color: rawColor = 'currentColor', size = 24, style, ...restProps },
    forwardedRef
  ) => {
    const color = getColor(rawColor);
    const pathId = useId();

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        {...restProps}
        ref={forwardedRef}
        style={{ width: size, height: size, flexShrink: 0, ...style }}
      >
        <g clipPath={`url(#${pathId})`}>
          <path
            d="M11 20.1666C16.0627 20.1666 20.1667 16.0626 20.1667 11C20.1667 5.93737 16.0627 1.83331 11 1.83331C5.93743 1.83331 1.83337 5.93737 1.83337 11C1.83337 16.0626 5.93743 20.1666 11 20.1666Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 14.6667V11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 7.33331H11.01"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id={pathId}>
            <rect width="22" height="22" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }
);
