import { forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

export interface AlertTriangleIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

export const AlertTriangleIcon = forwardRef<
  SVGSVGElement,
  AlertTriangleIconProps
>(
  (
    { color: rawColor = 'currentColor', size = 24, style, ...restProps },
    forwardedRef
  ) => {
    const color = getColor(rawColor);

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
        <path
          d="M9.43246 3.53834L1.66829 16.5C1.50821 16.7772 1.42351 17.0915 1.42261 17.4116C1.42172 17.7318 1.50466 18.0465 1.66318 18.3247C1.82171 18.6028 2.05029 18.8345 2.32619 18.9969C2.60209 19.1592 2.91569 19.2465 3.23579 19.25H18.7641C19.0842 19.2465 19.3978 19.1592 19.6737 18.9969C19.9496 18.8345 20.1782 18.6028 20.3367 18.3247C20.4953 18.0465 20.5782 17.7318 20.5773 17.4116C20.5764 17.0915 20.4917 16.7772 20.3316 16.5L12.5675 3.53834C12.404 3.26894 12.174 3.0462 11.8994 2.89161C11.6248 2.73703 11.315 2.65582 11 2.65582C10.6849 2.65582 10.3751 2.73703 10.1005 2.89161C9.82596 3.0462 9.59587 3.26894 9.43246 3.53834Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 8.25V11.9167"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 15.5833H11.011"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);
