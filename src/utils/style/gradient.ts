export function radialGradient(x: string, y: string, colors: string[]) {
  return `radial-gradient(at ${x} ${y}, ${colors.join(', ')})`;
}
