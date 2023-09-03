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

export function getBase64Url(data: string, type: 'svg' | 'png' | 'jpeg') {
  const t = type === 'svg' ? 'svg+xml' : type;
  return `url(data:image/${t};base64,${data})`;
}
