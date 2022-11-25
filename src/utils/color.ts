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
