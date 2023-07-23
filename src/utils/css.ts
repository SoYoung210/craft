import { CSSUnit } from './type';

export const withUnit = (value: number | string, unit: CSSUnit = 'px') => {
  return typeof value === 'number' ? `${value}${unit}` : value;
};

type VariableType = `--${string}`;
export const getVar = (variable: VariableType, defaultValue?: string) => {
  if (defaultValue != null) {
    return `var(${variable}, ${defaultValue})`;
  }

  return `var(${variable})`;
};
