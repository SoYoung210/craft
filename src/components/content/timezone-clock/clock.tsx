'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import type { ClockProps } from './types';
import { ClockHand } from './clockHand';
import { getTimeParts, get24HourFormat } from './utils';

const CLOCK_CENTER_X = 100;
const CLOCK_CENTER_Y = 100;
const CLOCK_RADIUS = 88; // Main radius for markers

export function Clock({
  timeZone,
  label,
  baseTime,
  onTimeAdjust,
  colorScheme,
}: ClockProps) {
  const [currentTimeParts, setCurrentTimeParts] = useState(
    getTimeParts(baseTime, timeZone)
  );
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);

  const clockRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setCurrentTimeParts(getTimeParts(baseTime, timeZone));
  }, [baseTime, timeZone]);

  const { hours, minutes, seconds, amPm } = currentTimeParts;

  const secondHandRotation = (seconds / 60) * 360;
  const minuteHandRotation = ((minutes + seconds / 60) / 60) * 360;
  const hourHandRotation =
    (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * 360;

  const getAngle = useCallback((event: MouseEvent | TouchEvent) => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();

    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      'touches' in event ? event.touches[0].clientY : event.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * 200;
    const svgY = ((clientY - rect.top) / rect.height) * 200;

    const deltaX = svgX - CLOCK_CENTER_X;
    const deltaY = svgY - CLOCK_CENTER_Y;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const handleInteraction = useCallback(
    (event: MouseEvent | TouchEvent, handType: 'hour' | 'minute') => {
      const angle = getAngle(event);
      const { hours24: currentHour24, minutes: currentMinuteOfHour } =
        get24HourFormat(baseTime, timeZone);

      let newHour24: number;
      let newMinute: number;

      if (handType === 'minute') {
        newHour24 = currentHour24;
        newMinute = Math.round((angle / 360) * 60) % 60;
      } else {
        const rawHourValue = (angle / 360) * 12;
        let newHour12 = Math.round(rawHourValue);
        if (newHour12 === 0) newHour12 = 12;

        const currentIsPM = currentHour24 >= 12;

        if (currentIsPM) {
          if (newHour12 < 12) newHour24 = newHour12 + 12;
          else newHour24 = newHour12;
        } else {
          if (newHour12 === 12) newHour24 = 0;
          else newHour24 = newHour12;
        }
        newMinute = currentMinuteOfHour;
      }

      const currentTotalMinutes = currentHour24 * 60 + currentMinuteOfHour;
      const newTotalMinutes = newHour24 * 60 + newMinute;
      let minuteAdjustment = newTotalMinutes - currentTotalMinutes;

      const halfDayMinutes = 12 * 60;
      if (Math.abs(minuteAdjustment) > halfDayMinutes) {
        if (minuteAdjustment > 0) {
          minuteAdjustment -= 2 * halfDayMinutes;
        } else {
          minuteAdjustment += 2 * halfDayMinutes;
        }
      }
      onTimeAdjust(minuteAdjustment);
    },
    [baseTime, timeZone, onTimeAdjust, getAngle]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDraggingHour) handleInteraction(event, 'hour');
      if (isDraggingMinute) handleInteraction(event, 'minute');
    },
    [isDraggingHour, isDraggingMinute, handleInteraction]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      if (isDraggingHour) {
        event.preventDefault();
        handleInteraction(event, 'hour');
      }
      if (isDraggingMinute) {
        event.preventDefault();
        handleInteraction(event, 'minute');
      }
    },
    [isDraggingHour, isDraggingMinute, handleInteraction]
  );

  const onMouseUp = useCallback(() => {
    setIsDraggingHour(false);
    setIsDraggingMinute(false);
  }, []);

  useEffect(() => {
    const currentClockRef = clockRef.current;
    if (!currentClockRef) return;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    currentClockRef.addEventListener('touchmove', onTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (currentClockRef) {
        currentClockRef.removeEventListener('touchmove', onTouchMove);
      }
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  const handleAmPmToggle = useCallback(() => {
    const currentAmPmForThisClock = getTimeParts(baseTime, timeZone).amPm;
    let minuteAdjustment = 0;
    if (currentAmPmForThisClock === 'AM') {
      minuteAdjustment = 12 * 60;
    } else {
      minuteAdjustment = -12 * 60;
    }
    onTimeAdjust(minuteAdjustment);
  }, [baseTime, timeZone, onTimeAdjust]);

  const markers = [];
  for (let i = 0; i < 60; i++) {
    const angle = i * 6;
    const isHourMark = i % 5 === 0;
    const markerLength = isHourMark ? 6 : 3;
    const strokeWidth = isHourMark ? '1.2' : '0.8';
    const x1 =
      CLOCK_CENTER_X +
      (CLOCK_RADIUS - markerLength) * Math.sin((angle * Math.PI) / 180);
    const y1 =
      CLOCK_CENTER_Y -
      (CLOCK_RADIUS - markerLength) * Math.cos((angle * Math.PI) / 180);
    const x2 =
      CLOCK_CENTER_X + CLOCK_RADIUS * Math.sin((angle * Math.PI) / 180);
    const y2 =
      CLOCK_CENTER_Y - CLOCK_RADIUS * Math.cos((angle * Math.PI) / 180);
    markers.push(
      <line
        key={`mark-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={strokeWidth}
        className={
          colorScheme === 'light-blue'
            ? 'stroke-[rgba(0,40,80,0.8)]'
            : 'stroke-[rgba(50,20,0,0.8)]'
        }
        strokeLinecap="round"
      />
    );
  }

  const caseBgColor =
    colorScheme === 'light-blue' ? 'bg-[#A6BFBC]' : 'bg-[#FF6B2B]';
  const handsColor = colorScheme === 'light-blue' ? '#A6C9C3' : '#DD3300';
  const markersAndNumeralsColorClass =
    colorScheme === 'light-blue'
      ? 'fill-[rgba(0,40,80,0.8)]'
      : 'fill-[rgba(50,20,0,0.8)]';
  const secondHandColor = colorScheme === 'light-blue' ? '#0077CC' : '#CC3300';
  const labelTextColor =
    colorScheme === 'light-blue' ? 'text-[#002C56]' : 'text-[#331400]';

  // Shape classes
  const containerShapeClass = 'rounded-xl';

  return (
    <div className="flex flex-col items-center">
      <h2 className={`text-xl font-semibold mb-1 ${labelTextColor}`}>
        {label}
      </h2>
      <div
        onClick={handleAmPmToggle}
        className={`cursor-pointer text-base font-medium mb-2 px-3 py-0.5 rounded-md shadow-sm transition-colors 
                    ${labelTextColor} hover:bg-muted/30 active:bg-muted/50 border border-transparent hover:border-muted`}
        aria-label={`Toggle AM/PM for ${label}. Current setting is ${amPm}.`}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAmPmToggle();
          }
        }}
      >
        {amPm}
      </div>
      <div
        className={`w-60 h-60 md:w-72 md:h-72 p-2 ${caseBgColor} ${containerShapeClass} relative transition-all duration-300 overflow-hidden`}
        style={{
          boxShadow:
            colorScheme === 'light-blue'
              ? '0 10px 25px rgba(176,220,227,0.4), 0 5px 10px rgba(176,220,227,0.2), inset 0 -2px 3px rgba(0,0,0,0.07), inset -2px 0 3px rgba(0,0,0,0.04), inset 2px 0 3px rgba(0,0,0,0.04)'
              : '0 10px 25px rgba(179,69,21,0.4), 0 5px 10px rgba(179,69,21,0.2), inset 0 -2px 3px rgba(0,0,0,0.1), inset -2px 0 3px rgba(0,0,0,0.06), inset 2px 0 3px rgba(0,0,0,0.06)',
        }}
        data-ai-hint="braun clock"
      >
        {/* Realistic light reflection at the top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              colorScheme === 'light-blue'
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.4))'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.65), rgba(255,255,255,0.3))',
            borderTopLeftRadius: '0.75rem',
            borderTopRightRadius: '0.75rem',
          }}
        />

        {/* Subtle top area reflection */}
        <div
          className="absolute top-[2px] left-0 right-0"
          style={{
            height: '8%',
            background:
              colorScheme === 'light-blue'
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0) 80%)'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0) 80%)',
          }}
        />

        {/* Left shadow */}
        <div
          className="absolute top-0 left-0 bottom-0 w-[3px]"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0))',
          }}
        />

        {/* Right shadow */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[3px]"
          style={{
            background:
              'linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0))',
          }}
        />

        {/* Bottom shadow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.08), rgba(0,0,0,0))',
          }}
        />

        <svg
          ref={clockRef}
          viewBox="0 0 200 200"
          className={`w-full h-full touch-none ${containerShapeClass} overflow-hidden`}
          onMouseDown={e => {
            const angle = getAngle(e.nativeEvent);
            const minuteAngle = minuteHandRotation % 360;
            const hourAngle = hourHandRotation % 360;

            const diffMinute = Math.min(
              Math.abs(angle - minuteAngle),
              360 - Math.abs(angle - minuteAngle)
            );
            const diffHour = Math.min(
              Math.abs(angle - hourAngle),
              360 - Math.abs(angle - hourAngle)
            );

            if (diffMinute < diffHour && diffMinute < 25) {
              e.preventDefault();
              setIsDraggingMinute(true);
              handleInteraction(e.nativeEvent, 'minute');
            } else if (diffHour < 25) {
              e.preventDefault();
              setIsDraggingHour(true);
              handleInteraction(e.nativeEvent, 'hour');
            } else if (diffMinute < 25) {
              e.preventDefault();
              setIsDraggingMinute(true);
              handleInteraction(e.nativeEvent, 'minute');
            }
          }}
          onTouchStart={e => {
            const angle = getAngle(e.nativeEvent);
            const minuteAngle = minuteHandRotation % 360;
            const hourAngle = hourHandRotation % 360;

            const diffMinute = Math.min(
              Math.abs(angle - minuteAngle),
              360 - Math.abs(angle - minuteAngle)
            );
            const diffHour = Math.min(
              Math.abs(angle - hourAngle),
              360 - Math.abs(angle - hourAngle)
            );

            if (diffMinute < diffHour && diffMinute < 30) {
              setIsDraggingMinute(true);
              handleInteraction(e.nativeEvent, 'minute');
            } else if (diffHour < 30) {
              setIsDraggingHour(true);
              handleInteraction(e.nativeEvent, 'hour');
            } else if (diffMinute < 30) {
              setIsDraggingMinute(true);
              handleInteraction(e.nativeEvent, 'minute');
            }
          }}
        >
          <defs>
            <filter
              id={`inner-shadow-${colorScheme}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feOffset dx="0.5" dy="0.5" />
              <feGaussianBlur stdDeviation="1" result="offset-blur" />
              <feComposite
                operator="out"
                in="SourceGraphic"
                in2="offset-blur"
                result="inverse"
              />
              <feFlood floodColor="black" floodOpacity="0.2" result="color" />
              <feComposite
                operator="in"
                in="color"
                in2="inverse"
                result="shadow"
              />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>

            <linearGradient
              id={`faceGradient-${colorScheme}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {colorScheme === 'light-blue' ? (
                <>
                  <stop offset="0%" stopColor="#EAF7FA" />
                  <stop offset="100%" stopColor="#D8ECF0" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FF7940" />
                  <stop offset="100%" stopColor="#FF5C16" />
                </>
              )}
            </linearGradient>

            <clipPath id={`clockFaceClip-${colorScheme}`}>
              <circle cx="100" cy="100" r="90" />
            </clipPath>

            <filter
              id={`softBlur-${colorScheme}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>

            <filter id={`gloss-${colorScheme}`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset in="blur" dx="0" dy="-4" result="offsetBlur" />
              <feSpecularLighting
                in="offsetBlur"
                surfaceScale="5"
                specularConstant="1"
                specularExponent="20"
                result="specOut"
              >
                <fePointLight x="100" y="50" z="200" />
              </feSpecularLighting>
              <feComposite
                in="specOut"
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
              />
            </filter>

            {/* Add filter for the raised bezel effect */}
            <filter
              id={`raisedBezel-${colorScheme}`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
              <feFlood
                floodColor="black"
                floodOpacity="0.3"
                result="shadowColor"
              />
              <feComposite
                in="shadowColor"
                in2="offsetBlur"
                operator="in"
                result="shadow"
              />
              <feComposite in="SourceGraphic" in2="shadow" operator="over" />
            </filter>

            {/* Radial gradient for bezel to give 3D appearance */}
            <radialGradient
              id={`bezelGradient-${colorScheme}`}
              cx="50%"
              cy="50%"
              r="95%"
              fx="50%"
              fy="30%"
            >
              {colorScheme === 'light-blue' ? (
                <>
                  <stop offset="75%" stopColor="#D8ECF0" />
                  <stop offset="95%" stopColor="#B8D2D8" />
                  <stop offset="100%" stopColor="#A8C2C8" />
                </>
              ) : (
                <>
                  <stop offset="75%" stopColor="#FF6B2B" />
                  <stop offset="95%" stopColor="#F05B1B" />
                  <stop offset="100%" stopColor="#E04B0B" />
                </>
              )}
            </radialGradient>

            {/* Flatter gradient for center dot */}
            <linearGradient
              id={`centerDotGradient-${colorScheme}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              {colorScheme === 'light-blue' ? (
                <>
                  <stop offset="0%" stopColor="#B8DBD5" />
                  <stop offset="95%" stopColor="#99BDB6" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#D84208" />
                  <stop offset="95%" stopColor="#C83903" />
                </>
              )}
            </linearGradient>

            {/* Subtle shadow for center dot */}
            <filter
              id={`centerDotShadow-${colorScheme}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation="0.5"
                result="blur"
              />
              <feOffset in="blur" dx="0" dy="0.5" result="offsetBlur" />
              <feFlood
                floodColor="black"
                floodOpacity="0.2"
                result="shadowColor"
              />
              <feComposite
                in="shadowColor"
                in2="offsetBlur"
                operator="in"
                result="shadow"
              />
              <feComposite in="SourceGraphic" in2="shadow" operator="over" />
            </filter>
          </defs>

          {/* Clock face with gradient */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill={`url(#faceGradient-${colorScheme})`}
            filter={`url(#inner-shadow-${colorScheme})`}
          />

          {/* Glass effect overlay */}
          <circle
            cx="100"
            cy="100"
            r="89"
            fill="transparent"
            stroke={
              colorScheme === 'light-blue'
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(255,255,255,0.3)'
            }
            strokeWidth="1"
          />

          {/* 3D effect for the raised bezel around clock face */}
          {/* Outer edge shadow */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={
              colorScheme === 'light-blue'
                ? 'rgba(0,0,0,0.1)'
                : 'rgba(0,0,0,0.15)'
            }
            strokeWidth="1"
            style={{ filter: 'blur(0.5px)' }}
          />

          {/* Raised bezel with gradient for 3D effect */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke={`url(#bezelGradient-${colorScheme})`}
            strokeWidth="6"
            style={{ filter: `url(#raisedBezel-${colorScheme})` }}
          />

          {/* Inner highlight on the raised bezel */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke={
              colorScheme === 'light-blue'
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.3)'
            }
            strokeWidth="0.8"
            strokeDasharray="0.5 4"
            strokeDashoffset="0"
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-30deg)',
              opacity: 0.8,
            }}
          />

          {markers}

          {Array.from({ length: 12 }, (_, i) => {
            const hourValue = i + 1;
            const angle = (hourValue / 12) * 360 - 90;
            const numeralRadius = CLOCK_RADIUS - 18;
            const x =
              CLOCK_CENTER_X +
              numeralRadius * Math.cos((angle * Math.PI) / 180);
            const y =
              CLOCK_CENTER_Y +
              numeralRadius * Math.sin((angle * Math.PI) / 180);

            return (
              <text
                key={`numeral-${hourValue}`}
                x={x}
                y={y + 4.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="'Helvetica Neue', Arial, sans-serif"
                className={markersAndNumeralsColorClass}
                fontWeight="500"
              >
                {hourValue}
              </text>
            );
          })}

          <text
            x="100"
            y="145"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            className={markersAndNumeralsColorClass}
            letterSpacing="0.5"
            style={{ opacity: 0.85 }}
          >
            BRAUN
          </text>

          {/* Enhanced light reflection effect */}
          <ellipse
            cx="100"
            cy="65"
            rx="75"
            ry="45"
            fill="white"
            opacity={colorScheme === 'light-blue' ? '0.07' : '0.1'}
            filter={`url(#softBlur-${colorScheme})`}
            clipPath={`url(#clockFaceClip-${colorScheme})`}
            style={{ pointerEvents: 'none' }}
          />

          {/* Additional reflections for 3D effect */}
          <ellipse
            cx="120"
            cy="45"
            rx="20"
            ry="10"
            fill="white"
            opacity="0.08"
            filter={`url(#softBlur-${colorScheme})`}
            clipPath={`url(#clockFaceClip-${colorScheme})`}
            style={{ pointerEvents: 'none' }}
          />

          <ClockHand
            data-testid="hour-hand"
            rotation={hourHandRotation}
            length={45}
            strokeWidth={5}
            color={handsColor}
          />
          <ClockHand
            data-testid="minute-hand"
            rotation={minuteHandRotation}
            length={70}
            strokeWidth={4}
            color={handsColor}
          />
          <ClockHand
            data-testid="second-hand"
            rotation={secondHandRotation}
            length={75}
            strokeWidth={1.5}
            color={secondHandColor}
          />

          {/* Flatter center dot with subtle lighting */}
          <circle
            cx="100"
            cy="100"
            r="9"
            fill={`url(#centerDotGradient-${colorScheme})`}
            filter={`url(#centerDotShadow-${colorScheme})`}
          />

          {/* Very subtle top highlight - moved higher up */}
          <path
            d="M95,94 Q100,92 105,94"
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            opacity={colorScheme === 'light-blue' ? '0.35' : '0.2'}
            style={{ pointerEvents: 'none' }}
          />

          {/* Small OFF indicator at bottom (as seen in reference image) */}
          <text
            x="100"
            y="125"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="6"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            className={markersAndNumeralsColorClass}
            letterSpacing="0.2"
            style={{ opacity: 0.7 }}
          >
            OFF
          </text>
          <polygon
            points="100,132 103,136 97,136"
            className={markersAndNumeralsColorClass}
            style={{ opacity: 0.7 }}
          />
        </svg>
      </div>
    </div>
  );
}
