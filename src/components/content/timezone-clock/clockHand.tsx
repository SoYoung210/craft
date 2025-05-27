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
          y1="100" // Start at center for better drag behavior
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
          y1="100" // Start at center for better drag behavior
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

    // Calculate hand length, keeping a bit of the hand extending into the center for better dragging
    const handBodyHeight = length * 0.85 - (hasWhiteTip ? tipLength : 0);

    return (
      <g transform={`rotate(${rotation} 100 100)`} {...props}>
        {/* Invisible wider touch area for better dragging */}
        <rect
          x={100 - handWidth * 1.5}
          y={100 - length}
          width={handWidth * 3}
          height={length}
          fill="transparent"
          style={{ cursor: 'pointer' }}
        />

        {/* Hand shadow based on lighting from above */}
        <rect
          x={100 - handWidth / 2 + 0.5}
          y={100 - handBodyHeight} // Start at center for better drag behavior
          width={handWidth}
          height={handBodyHeight} // Full length from center
          rx={handWidth / 2}
          ry={handWidth / 2}
          fill="rgba(0,0,0,0.25)"
          transform="translate(1.5, 1)"
          style={{ filter: 'blur(1.2px)' }}
        />

        {/* Main hand body - rectangle with rounded ends */}
        <rect
          x={100 - handWidth / 2}
          y={100 - handBodyHeight} // Start at center for better drag behavior
          width={handWidth}
          height={handBodyHeight}
          rx={handWidth / 2}
          ry={handWidth / 2}
          fill={color}
        />

        {/* White tip at the end of the hand if enabled */}
        {hasWhiteTip && (
          <rect
            x={100 - handWidth / 2}
            y={100 - length}
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
          r={handWidth * 0.8}
          fill={color}
          style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))' }}
        />
      </g>
    );
  }
}
