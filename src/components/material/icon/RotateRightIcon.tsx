import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface RotateRightIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const RotateRightIcon = forwardRef<SVGSVGElement, RotateRightIconProps>(
  (props, ref) => {
    const { color: rawColor = 'currentColor', size = 24, ...restProps } = props;
    const color = getColor(rawColor);

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...restProps}
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    );
  }
);
