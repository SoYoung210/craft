import { colors, PresetColorType } from '../../stitches.config';

import { LiteralUnion } from './type';

export type ColorType = LiteralUnion<PresetColorType, string>;

export function isPresetColor(color: ColorType): color is PresetColorType {
  return (
    !color.startsWith('currentColor') &&
    !color.startsWith('rgba(') &&
    !color.startsWith('rgb(') &&
    !color.startsWith('hsla(') &&
    !color.startsWith('hsl(') &&
    !color.startsWith('#') &&
    !color.startsWith('var(') &&
    !color.startsWith('linear-gradient(')
  );
}

export function getColor(color: ColorType) {
  return isPresetColor(color) ? colors[color as keyof typeof colors] : color;
}

export function hexToRGBA(hexColor: string, alpha = 1.0): string {
  // hexColor 문자열에서 '#' 기호를 제거하고, 각각의 색상 값을 추출합니다.
  const hexColorWithoutHash = hexColor.replace('#', '');
  const r = parseInt(hexColorWithoutHash.slice(0, 2), 16);
  const g = parseInt(hexColorWithoutHash.slice(2, 2), 16);
  const b = parseInt(hexColorWithoutHash.slice(4, 2), 16);

  // 알파 값은 0부터 1까지의 범위를 가지도록 정규화합니다.
  const a = Math.min(1.0, Math.max(0.0, alpha));

  // RGBA 형식으로 변환한 값을 반환합니다.
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgbToRGBA(rgbColor: string, alpha = 1.0): string {
  // rgbColor 문자열에서 'rgb('와 ')'를 제거하고, 각각의 색상 값을 추출합니다.
  const colorValues = rgbColor.replace('rgb(', '').replace(')', '').split(',');
  const r = parseInt(colorValues[0].trim(), 10);
  const g = parseInt(colorValues[1].trim(), 10);
  const b = parseInt(colorValues[2].trim(), 10);

  // 알파 값은 0부터 1까지의 범위를 가지도록 정규화합니다.
  const a = Math.min(1.0, Math.max(0.0, alpha));

  // RGBA 형식으로 변환한 값을 반환합니다.
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function isHexColor(color: string): boolean {
  // HEX 색상 형식은 #으로 시작하며, 길이가 7이어야 합니다 (예: "#fff").
  return /^#([A-Fa-f0-9])$/.test(color);
}

export function isRGBColor(color: string): boolean {
  // RGB 색상 형식은 "rgb(숫자, 숫자, 숫자)" 형식이어야 합니다 (예: "rgb(255, 255, 255)").
  return /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(color);
}

export type HEXColor = `#${string}`;
export type RGBColor = `rgb(${number},${number},${number})`;
