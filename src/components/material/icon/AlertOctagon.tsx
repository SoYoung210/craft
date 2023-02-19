import { useId, forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface AlertOctagonIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const AlertOctagonIcon = forwardRef<
  SVGSVGElement,
  AlertOctagonIconProps
>(
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
            d="M7.20504 1.83331H14.795L20.1667 7.20498V14.795L14.795 20.1666H7.20504L1.83337 14.795V7.20498L7.20504 1.83331Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 7.33331V11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 14.6667H11.01"
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
