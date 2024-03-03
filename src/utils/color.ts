import chroma, { InterpolationMode } from 'chroma-js';
import { easingCoordinates } from 'easing-coordinates';

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
  const g = parseInt(hexColorWithoutHash.slice(2, 4), 16);
  const b = parseInt(hexColorWithoutHash.slice(4, 6), 16);

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
  return /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/.test(color);
}

export function isRGBColor(color: string): boolean {
  // RGB 색상 형식은 "rgb(숫자, 숫자, 숫자)" 형식이어야 합니다 (예: "rgb(255, 255, 255)").
  return /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(color);
}

export type HEXColor = `#${string}`;
export type RGBColor = `rgb(${number},${number},${number})`;

/**
 * reference: https://github.com/larsenwork/postcss-easing-gradients/blob/master/lib/colorStops.js
 */
type BezierCurve = [number, number, number, number];

type EasingType = BezierCurve | 'ease-in' | 'ease-out' | 'ease-in-out';

// https://github.com/larsenwork/larsenwork.github.io/blob/dev/components/tools/gradient/calculations/gradient-output.js#L33
export function linearGradient(
  easing: EasingType,
  colors: [string, string],
  direction: string
): string {
  const numStops = 12;
  let coordinates: Array<{ x: number; y: number }> = [];

  switch (easing) {
    case 'ease-in':
      coordinates = easingCoordinates(`cubic-bezier(0.42, 0, 1, 1)`, numStops);
      break;
    case 'ease-out':
      coordinates = easingCoordinates(`cubic-bezier(0, 0, 0.58, 1)`, numStops);
      break;
    case 'ease-in-out':
      coordinates = easingCoordinates(
        `cubic-bezier(0.42, 0, 0.58, 1)`,
        numStops
      );
      break;
  }

  const colorStops = getColorStops(colors, coordinates);
  return `linear-gradient(${direction}, ${colorStops.join(', ')})`;
}

function getColorStops(
  colors: [string, string],
  coordinates: Array<{ x: number; y: number }>,
  alphaDecimals = 5,
  colorMode: InterpolationMode = 'lrgb'
) {
  const colorStops: string[] = [];

  const colorsWithAlpha = transparentFix(colors);
  coordinates.forEach(coordinate => {
    const amount = coordinate.y;
    const percent = coordinate.x * 100;
    let color = chroma
      .mix(colorsWithAlpha[0], colorsWithAlpha[1], amount, colorMode)
      .css('hsl');
    color = roundHslAlpha(color, alphaDecimals);

    if (Number(coordinate.x) !== 0 && Number(coordinate.x) !== 1) {
      colorStops.push(`${color} ${+percent.toFixed(2)}%`);
    } else {
      colorStops.push(color);
    }
  });

  return colorStops;
}

function transparentFix(colors: [string, string]) {
  return colors.map((color, i) => {
    return color === 'transparent'
      ? chroma(colors[Math.abs(i - 1)])
          .alpha(0)
          .css('hsl')
      : color;
  });
}

function roundHslAlpha(color: string, alphaDecimals: number) {
  const prefix = getBeforeParenthesisMaybe(color);
  const values = getParenthesisInsides(color)
    .split(',')
    .map(string =>
      string.indexOf('%') === -1
        ? +Number(string).toFixed(alphaDecimals)
        : string.trim()
    );
  color = `${prefix}(${values.join(', ')})`;
  return color;
}

const hasParenthesis = (str: string) => str.indexOf('(') !== -1;
const getBeforeParenthesisMaybe = (str: string) =>
  hasParenthesis(str) ? str.substring(0, str.indexOf('(')) : str;

const getParenthesisInsides = (str: string): string =>
  str.match(/\((.*)\)/)!.pop() as string;
