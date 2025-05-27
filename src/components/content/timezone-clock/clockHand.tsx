import type { SVGProps } from 'react';

interface ClockHandProps extends SVGProps<SVGLineElement> {
  rotation: number;
  length: number;
  strokeWidth: number;
  color: string;
}

export function ClockHand({
  rotation,
  length,
  strokeWidth = 4,
  color = 'hsl(var(--foreground))',
  ...props
}: ClockHandProps) {
  return (
    <line
      x1="100"
      y1="100"
      x2="100"
      y2={100 - length}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      transform={`rotate(${rotation} 100 100)`}
      {...props}
    />
  );
}
