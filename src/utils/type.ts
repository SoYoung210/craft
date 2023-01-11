/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U = string> = T | (U & { __?: never });

export type PrimitiveValue = string | number;
export type CSSUnit = 'px' | 'em' | 'rem' | 'vw' | 'vh';
