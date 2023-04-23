import { CSSUnit } from './type';

export const withUnit = (value: number | string, unit: CSSUnit = 'px') => {
  return typeof value === 'number' ? `${value}${unit}` : value;
};
