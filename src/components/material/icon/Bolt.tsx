import { useId, forwardRef, SVGAttributes } from 'react';

import { ColorType, getColor } from '../../../utils/color';

interface BaseIconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: ColorType;
  size?: number;
}

interface FillIconProps extends BaseIconProps {
  type: 'fill';
  animate?: boolean;
}

interface DefaultIconProps extends BaseIconProps {
  type?: 'default';
}

export type BoltIconProps = FillIconProps | DefaultIconProps;

export const BoltIcon = forwardRef<SVGSVGElement, BoltIconProps>(
  (
    {
      color: rawColor = 'currentColor',
      size = 24,
      type = 'default',
      style,
      ...props
    },
    forwardedRef
  ) => {
    const color = getColor(rawColor);
    const gradientId = useId();

    if (type === 'fill') {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
          ref={forwardedRef}
          style={{ width: size, height: size, flexShrink: 0, ...style }}
        >
          <path
            d="M13.6646 1.5L5.25497 13.3399L6.00001 14.6804H10.3789L8.71888 21.8329L10.3428 22.5L18.7452 10.6601L18 9.31989H13.622L15.2881 2.16807L13.6646 1.5Z"
            fill={'animate' in props ? `url(#${gradientId})` : color}
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="100%" stopColor="transparent" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </svg>
      );
    }

    if (type === 'default') {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
          ref={forwardedRef}
          style={{ width: size, height: size, flexShrink: 0, ...style }}
        >
          <path
            d="M7.69713 12.9629H11L11.8882 13.96L11.1445 18.3072L16.3037 11.0373H13L12.1119 10.0396L12.8589 5.69568L7.69713 12.9629ZM5.25497 13.3399L13.6646 1.5L15.2977 2.12078L14.0597 9.3199H18L18.7452 10.6601L10.3428 22.5L8.70934 21.8802L9.94117 14.6804H6L5.25497 13.3399Z"
            fill={color}
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    console.error(
      `BoltIcon doesn't support the combination of ${size} and ${type}`
    );
    return null;
  }
);
