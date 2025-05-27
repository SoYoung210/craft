import type { SVGProps } from 'react';

interface ClockHandProps extends SVGProps<SVGLineElement> {
  rotation: number;
  length: number;
  strokeWidth: number;
  color: string;
  hasWhiteTip?: boolean;
}

export function ClockHand({
  rotation,
  length,
  strokeWidth = 4,
  color = 'hsl(var(--foreground))',
  hasWhiteTip = false,
  ...props
}: ClockHandProps) {
  // Determine if this is likely the second hand based on properties
  const isSecondHand = strokeWidth < 2;

  if (isSecondHand) {
    // For second hand, create a line with shadow
    return (
      <>
        {/* Shadow for second hand */}
        <line
          x1="100"
          y1="101" // Start slightly below center for floating effect
          x2="100"
          y2={100 - length}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={strokeWidth + 0.6}
          strokeLinecap="round"
          transform={`rotate(${rotation + 0.5} 100 100)`} // Offset shadow slightly
          style={{ filter: 'blur(0.7px)' }}
        />
        {/* Second hand */}
        <line
          x1="100"
          y1="101" // Start slightly below center for floating effect
          x2="100"
          y2={100 - length}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(${rotation} 100 100)`}
          {...props}
        />
      </>
    );
  } else {
    // For hour and minute hands with rounded ends
    const handWidth = strokeWidth * 1.2;
    const tipLength = hasWhiteTip ? length * 0.12 : 0; // Length of the white tip

    return (
      <g transform={`rotate(${rotation} 100 100)`} {...props}>
        {/* Hand shadow based on lighting from above */}
        <rect
          x={100 - handWidth / 2 + 0.5}
          y={101} // Start slightly below center for floating effect
          width={handWidth}
          height={length * 0.85 - 2} // Slightly shorter to match the floating effect
          rx={handWidth / 2}
          ry={handWidth / 2}
          fill="rgba(0,0,0,0.25)"
          transform="translate(1.5, 2)"
          style={{ filter: 'blur(1.2px)' }}
        />

        {/* Main hand body - rectangle with rounded ends */}
        <rect
          x={100 - handWidth / 2}
          y={101} // Start slightly below center for floating effect
          width={handWidth}
          height={length * 0.85 - (hasWhiteTip ? tipLength : 0) - 2}
          rx={handWidth / 2}
          ry={handWidth / 2}
          fill={color}
        />

        {/* White tip at the end of the hand if enabled */}
        {hasWhiteTip && (
          <rect
            x={100 - handWidth / 2}
            y={101 + length * 0.85 - tipLength - 2}
            width={handWidth}
            height={tipLength}
            rx={handWidth / 2}
            ry={handWidth / 2}
            fill="#FFFFFF"
          />
        )}

        {/* Center connector to show the 3D connection */}
        <circle
          cx="100"
          cy="100"
          r={handWidth * 0.7}
          fill={color}
          style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))' }}
        />
      </g>
    );
  }
}
