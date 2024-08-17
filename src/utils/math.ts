export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface Position {
  x: number;
  y: number;
}
export function getAngleBetweenPositions(a: Position, b: Position) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) {
    angle += 360;
  }

  return angle;
}

export function getDistanceBetween(a: Position, b: Position): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
