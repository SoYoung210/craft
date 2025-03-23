import type React from 'react';
import { motion } from 'framer-motion';

import { cn } from '../../../utils/css';

export interface CircleProgressProps {
  /**
   * The progress percentage (0-100)
   */
  percentage: number;
  /**
   * The size of the circle in pixels
   * @default 120
   */
  size?: number;
  /**
   * The width of the progress track and indicator
   * @default 10
   */
  strokeWidth?: number;
  /**
   * The color of the progress track
   * @default "#e5e7eb" (gray-200)
   */
  trackColor?: string;
  /**
   * The color of the progress indicator
   * @default "#3b82f6" (blue-500)
   */
  indicatorColor?: string;
  /**
   * Whether to show the percentage text in the center
   * @default true
   */
  showPercentage?: boolean;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Additional class name for the percentage text
   */
  textClassName?: string;
  /**
   * Duration of the animation in seconds
   * @default 0.8
   */
  animationDuration?: number;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  trackColor = '#e5e7eb',
  indicatorColor = '#3b82f6',
  showPercentage = true,
  className,
  textClassName,
  animationDuration = 0.8,
}) => {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedPercentage / 100) * circumference;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Track Circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress Indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={indicatorColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animationDuration, ease: 'easeInOut' }}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('text-lg font-medium', textClassName)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: animationDuration * 0.5 }}
          >
            {Math.round(normalizedPercentage)}%
          </motion.span>
        </div>
      )}
    </div>
  );
};
