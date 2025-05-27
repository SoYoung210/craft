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
  // Determine if this is likely the second hand based on properties
  const isSecondHand = strokeWidth < 2;

  if (isSecondHand) {
    // For second hand, use a simple line with rounded tip
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
  } else {
    // For hour and minute hands, create a more rectangular design with rounded ends
    // The width narrows slightly toward the end but stays relatively flat
    const handWidth = strokeWidth * 1.2;

    return (
      <g transform={`rotate(${rotation} 100 100)`} {...props}>
        {/* Main hand body - rectangular with slightly tapered sides */}
        <rect
          x={100 - handWidth / 2}
          y={100 - length}
          width={handWidth}
          height={length * 0.85} // Leave room at the center for the pin
          rx={handWidth / 2} // Rounded corners at the tip
          ry={handWidth / 2}
          fill={color}
        />

        {/* Small rounded end cap at the center */}
        <circle cx="100" cy="100" r={handWidth / 2} fill={color} />
      </g>
    );
  }
}
