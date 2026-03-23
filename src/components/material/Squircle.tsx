import { ComponentPropsWithoutRef, CSSProperties } from 'react';

import { cn } from '../../utils/cn';
import { getBase64Url } from '../../utils/css';

// ref: https://daisyui.com/components/avatar/
export const SQUIRCLE_SHAPE_MASK =
  'PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTAwIDBDMjAgMCAwIDIwIDAgMTAwczIwIDEwMCAxMDAgMTAwIDEwMC0yMCAxMDAtMTAwUzE4MCAwIDEwMCAwWicvPjwvc3ZnPg==';
export const SQUIRCLE_SHAPE_BORDER_MASK_URL =
  'PHN2ZyB3aWR0aD0iOTMiIGhlaWdodD0iOTMiIHZpZXdCb3g9IjAgMCA5MyA5MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUxMF83NykiPgo8cGF0aCBkPSJNMC41IDQ2LjVDMC41IDI3Ljg5NjQgMi44Mzc1NiAxNi40Njk1IDkuNjUzNTUgOS42NTM1NUMxNi40Njk1IDIuODM3NTYgMjcuODk2NCAwLjUgNDYuNSAwLjVDNjUuMTAzNiAwLjUgNzYuNTMwNCAyLjgzNzU2IDgzLjM0NjUgOS42NTM1NUM5MC4xNjI0IDE2LjQ2OTUgOTIuNSAyNy44OTY0IDkyLjUgNDYuNUM5Mi41IDY1LjEwMzYgOTAuMTYyNCA3Ni41MzA0IDgzLjM0NjUgODMuMzQ2NUM3Ni41MzA0IDkwLjE2MjQgNjUuMTAzNiA5Mi41IDQ2LjUgOTIuNUMyNy44OTY0IDkyLjUgMTYuNDY5NSA5MC4xNjI0IDkuNjUzNTUgODMuMzQ2NUMyLjgzNzU2IDc2LjUzMDQgMC41IDY1LjEwMzYgMC41IDQ2LjVaIiBzdHJva2U9IiNFREVERUQiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF81MTBfNzciPgo8cmVjdCB3aWR0aD0iOTMiIGhlaWdodD0iOTMiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';

export const SQUIRCLE_SHAPE_BORDER_GRADIENT_MASK_URL =
  'PHN2ZyB3aWR0aD0iOTMiIGhlaWdodD0iOTMiIHZpZXdCb3g9IjAgMCA5MyA5MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUxMF83NykiPgo8cGF0aCBkPSJNMC41IDQ2LjVDMC41IDI3Ljg5NjQgMi44Mzc1NiAxNi40Njk1IDkuNjUzNTUgOS42NTM1NUMxNi40Njk1IDIuODM3NTYgMjcuODk2NCAwLjUgNDYuNSAwLjVDNjUuMTAzNiAwLjUgNzYuNTMwNCAyLjgzNzU2IDgzLjM0NjUgOS42NTM1NUM5MC4xNjI0IDE2LjQ2OTUgOTIuNSAyNy44OTY0IDkyLjUgNDYuNUM5Mi41IDY1LjEwMzYgOTAuMTYyNCA3Ni41MzA0IDgzLjM0NjUgODMuMzQ2NUM3Ni41MzA0IDkwLjE2MjQgNjUuMTAzNiA5Mi41IDQ2LjUgOTIuNUMyNy44OTY0IDkyLjUgMTYuNDY5NSA5MC4xNjI0IDkuNjUzNTUgODMuMzQ2NUMyLjgzNzU2IDc2LjUzMDQgMC41IDY1LjEwMzYgMC41IDQ2LjVaIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcl81MTBfNzcpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl81MTBfNzciIHgxPSIxMy41IiB5MT0iMTUiIHgyPSI3NSIgeTI9IjgxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0VERURFRCIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNTEwXzc3Ij4KPHJlY3Qgd2lkdGg9IjkzIiBoZWlnaHQ9IjkzIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';

const MASK_IMAGE = getBase64Url(SQUIRCLE_SHAPE_MASK, 'svg');
const BORDER_IMAGE = getBase64Url(SQUIRCLE_SHAPE_BORDER_MASK_URL, 'svg');
const BORDER_GRADIENT_IMAGE = getBase64Url(
  SQUIRCLE_SHAPE_BORDER_GRADIENT_MASK_URL,
  'svg'
);

export interface SquircleProps extends ComponentPropsWithoutRef<'div'> {
  size?: number;
  borderType?: 'insetNormal' | 'gradient';
}
export function Squircle(props: SquircleProps) {
  const {
    size = 24,
    children,
    style: styleFromProps,
    className,
    borderType = 'insetNormal',
    ...restProps
  } = props;

  const afterBgImage =
    borderType === 'gradient' ? BORDER_GRADIENT_IMAGE : BORDER_IMAGE;

  const rootStyle: CSSProperties = {
    height: size,
    width: size,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskImage: MASK_IMAGE,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskImage: MASK_IMAGE,
    boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.04)',
    // CSS custom property for the ::after pseudo-element background-image
    // @ts-expect-error CSS custom property
    '--squircle-border-image': afterBgImage,
    ...styleFromProps,
  };

  return (
    <div
      className={cn(
        'squircle-root relative flex items-center justify-center',
        className
      )}
      style={rootStyle}
      {...restProps}
    >
      <div className="flex items-center justify-center w-full h-full backdrop-blur-[6px] bg-[rgba(252,252,252,0.7)]">
        {children}
      </div>
    </div>
  );
}
