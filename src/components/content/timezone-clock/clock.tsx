'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import type { ClockProps } from './types';
import { getTimeParts, get24HourFormat } from './utils';

// --- Figma-based proportions ---
const SVG_SIZE = 200;
const TICK_MARKS_RADIUS = 73; // Move tick marks further in
const NUMERAL_RADIUS = 54; // Move numerals further out from tick marks
const HOUR_HAND_LENGTH = 40;
const MINUTE_HAND_LENGTH = 56;
const SECOND_HAND_LENGTH = 66;
const CENTER_X = 100;
const CENTER_Y = 100;

export function Clock({ timeZone, label, baseTime, onTimeAdjust }: ClockProps) {
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

    const deltaX = svgX - CENTER_X;
    const deltaY = svgY - CENTER_Y;

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

  // Determine if it's day or night for theming
  const isDayTime = useMemo(() => {
    const hour = currentTimeParts.hours;
    const minute = currentTimeParts.minutes;
    // 6:00 AM (6,0) to 6:00 PM (18,0) is day
    if (hour > 6 && hour < 18) return true;
    if (hour === 6 && minute >= 0) return true;
    if (hour === 18 && minute === 0) return true;
    return false;
  }, [currentTimeParts]);

  // Theme colors
  const theme = isDayTime
    ? {
        bodyBg: 'linear-gradient(180deg, #F3F3F3 0%, #EAE9E9 100%)',
        tick: '#000',
        numeral: '#000',
        handBase: '#212121',
        handHighlight: 'url(#hourHandHighlight)',
        minHandHighlight: 'url(#minuteHandHighlight)',
        whiteArm: '#fff',
        whiteArmGreen: '#488E28',
        innerCircleBg: '#E8E8E8',
      }
    : {
        bodyBg: 'linear-gradient(180deg, #2B2B2B 0%, #1B1B1B 100%)',
        tick: '#fff',
        numeral: '#fff',
        handBase: 'url(#nightHandBase)',
        handHighlight: 'url(#nightHandBase)',
        minHandHighlight: 'url(#nightHandBase)',
        whiteArm: '#D8D8D8',
        whiteArmGreen: '#0FEC0F',
        innerCircleBg: 'linear-gradient(to right, #343434 0%, #292828 100%)',
      };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-1 text-black">{label}</h2>
      <div
        onClick={handleAmPmToggle}
        className="cursor-pointer text-base font-medium mb-2 px-3 py-0.5 rounded-md shadow-sm transition-colors 
                    text-black hover:bg-muted/30 active:bg-muted/50 border border-transparent hover:border-muted"
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

      {/* Clock case */}
      <div
        className="w-[300px] h-[300px] relative rounded-[20px] overflow-hidden"
        style={{
          background: theme.bodyBg,
          boxShadow:
            '0px 0px 16px 0px rgba(0, 0, 0, 0.23), inset 0px 6px 10px 0px rgba(255, 255, 255, 1), inset 0px -2px 8px 0px rgba(0, 0, 0, 0.19), inset 0px 0px 8px 0px rgba(0, 0, 0, 0.12), inset 2px 3px 20px 0px rgba(255, 255, 255, 0.37)',
          transition: 'background 0.7s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Outer circle frame */}
        <div
          data-name="outer-frame"
          className="absolute rounded-full inset-3"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F2F2 100%)',
            boxShadow:
              '0px 0px 2px 0px rgba(0,0,0,0.12), inset 0px 0px 4px 0.5px #fff, inset 0px 0px 0px 3.5px #fff',
            border: '1px solid #E0E0E0',
          }}
        />
        {/* Middle circle frame */}
        <div
          data-name="middle-frame"
          className="absolute inset-6 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #FFFCFC 0%, #F7F7F7 100%)',
            boxShadow:
              '0px 0px 0px 2px rgba(143,143,143,1), inset 0px 0px 16px 0px rgba(0,0,0,0.5)',
          }}
        />
        {/* Inner circle frame */}
        <div
          data-name="inner-frame"
          className="absolute inset-[30px] rounded-full border-2"
          style={{
            background: theme.innerCircleBg,
            borderColor: 'rgba(0,0,0,0.22)',
            boxShadow:
              'inset 0px 0px 0px 8px #d2cfcf, inset 0px 0px 32px 0px rgba(0,0,0,0.31), inset 0px -9px 3px 0px rgba(255,255,255,0.94)',
            transition: 'background 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        {/* SVG clock face (tick marks, numerals, hands, etc) */}
        <svg
          ref={clockRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="absolute touch-none"
          style={{
            zIndex: 1,
            left: 0,
            top: 0,
          }}
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
          {/* Tick marks - Figma style: inside frames */}
          {Array.from({ length: 60 }, (_, i) => {
            const angle = i * 6;
            const isHourMark = i % 5 === 0;
            const markerLength = isHourMark ? 7 : 4;
            const strokeWidth = 0.8;
            const x1 =
              CENTER_X +
              (TICK_MARKS_RADIUS - markerLength) *
                Math.sin((angle * Math.PI) / 180);
            const y1 =
              CENTER_Y -
              (TICK_MARKS_RADIUS - markerLength) *
                Math.cos((angle * Math.PI) / 180);
            const x2 =
              CENTER_X + TICK_MARKS_RADIUS * Math.sin((angle * Math.PI) / 180);
            const y2 =
              CENTER_Y - TICK_MARKS_RADIUS * Math.cos((angle * Math.PI) / 180);
            return (
              <line
                key={`mark-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={theme.tick}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(1px 1px 0px #E2E2E2)',
                  opacity: isHourMark ? 1 : 0.7,
                  transition: 'stroke 0.7s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            );
          })}

          {/* Hour numbers - Figma style: smaller, inside tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const hourValue = i + 1;
            const angle = (hourValue / 12) * 360 - 90;
            const x =
              CENTER_X + NUMERAL_RADIUS * Math.cos((angle * Math.PI) / 180);
            const y =
              CENTER_Y + NUMERAL_RADIUS * Math.sin((angle * Math.PI) / 180);
            return (
              <text
                key={`numeral-${hourValue}`}
                x={x}
                y={y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontFamily="'Helvetica Neue', Arial, sans-serif"
                fill={theme.numeral}
                fontWeight="400"
                style={{
                  filter: 'drop-shadow(0px 2px 0px rgba(219, 219, 219, 0.24))',
                  userSelect: 'none',
                  transition: 'fill 0.7s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {hourValue}
              </text>
            );
          })}

          {/* Black hour hand - fit inside numeral area */}
          <g
            transform={`rotate(${hourHandRotation}, ${CENTER_X}, ${CENTER_Y})`}
            style={{ filter: 'drop-shadow(0px 0px 18px rgba(0,0,0,0.4))' }}
          >
            <rect
              x={CENTER_X - 4}
              y={CENTER_Y - HOUR_HAND_LENGTH}
              width={6}
              height={HOUR_HAND_LENGTH}
              fill={theme.handBase}
              rx={4}
              style={{
                boxShadow: 'inset 0px 0px 5px 0px rgba(0,0,0,0.48)',
                transition: 'fill 0.7s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            {/* White cap on the arm */}
            <rect
              x={CENTER_X - 2}
              y={CENTER_Y - HOUR_HAND_LENGTH + 2}
              width={2.5}
              height={14}
              fill={theme.handHighlight}
              rx={2}
            />
          </g>
          <defs>
            <linearGradient id="hourHandHighlight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.01" stopColor="#E5E5E5" />
              <stop offset="1" stopColor="#D5D1D1" />
            </linearGradient>
            <linearGradient
              id="minuteHandHighlight"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0.01" stopColor="#E5E5E5" />
              <stop offset="1" stopColor="#D5D1D1" />
            </linearGradient>
            <linearGradient id="secondHand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA205" />
              <stop offset="100%" stopColor="#FFAC02" />
            </linearGradient>
            <linearGradient
              id="secondHandCap"
              x1="0"
              y1="1"
              x2="1"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="27.76%" stopColor="#FFAC00" />
              <stop offset="85.18%" stopColor="#FF970B" />
            </linearGradient>
            <filter
              id="secondHandCapShadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation="1.2"
                result="blur"
              />
              <feFlood
                floodColor="#FFD138"
                floodOpacity="0.32"
                result="color"
              />
              <feComposite
                in="color"
                in2="blur"
                operator="in"
                result="shadow"
              />
              <feComposite
                in="shadow"
                in2="SourceAlpha"
                operator="in"
                result="inset-shadow"
              />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="inset-shadow" />
              </feMerge>
            </filter>
            <linearGradient id="yellowArmPath" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFA205" />
              <stop offset="100%" stopColor="#FFAC02" />
            </linearGradient>
            <filter
              id="yellowArmRectShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feOffset dx="0" dy="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="whiteArmShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feOffset dx="0" dy="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Night theme hand gradient */}
            <linearGradient id="nightHandBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8D8D8" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Black minute hand - fit inside numeral area */}
          <g
            transform={`rotate(${minuteHandRotation}, ${CENTER_X}, ${CENTER_Y})`}
            style={{ filter: 'drop-shadow(0px 0px 18px rgba(0,0,0,0.4))' }}
          >
            <rect
              x={CENTER_X - 2.5}
              y={CENTER_Y - MINUTE_HAND_LENGTH}
              width={5}
              height={MINUTE_HAND_LENGTH}
              fill={theme.handBase}
              rx={3}
              style={{
                boxShadow: 'inset 0px 0px 5px 0px rgba(0,0,0,0.78)',
                transition: 'fill 0.7s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            {/* White cap on the arm */}
            <rect
              x={CENTER_X - 1}
              y={CENTER_Y - MINUTE_HAND_LENGTH + 4}
              width={2}
              height={12}
              fill={theme.minHandHighlight}
              rx={1}
            />
          </g>

          {/* White arm path from Untitled-1 SVG (fixed, not rotating) */}
          <g
            transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(0.26, 0.26) translate(-67, -80)`}
            style={{ filter: 'url(#whiteArmShadow)' }}
          >
            {/* Adjusted so the white circle is centered */}
            <path
              d="M67 30C95.1665 30 118 52.8335 118 81C118 106.792 98.8544 128.111 74 131.522V328H60V131.522C35.1456 128.111 16 106.792 16 81C16 52.8335 38.8335 30 67 30Z"
              fill={theme.whiteArm}
            />
            {/* Green rectangle from SVG */}
            <rect
              x="60"
              y="268"
              width="14"
              height="60"
              fill={theme.whiteArmGreen}
            />
          </g>
          {/* Yellow second hand - fit inside numeral area */}
          <g
            transform={`rotate(${secondHandRotation}, ${CENTER_X}, ${CENTER_Y})`}
          >
            {/* Yellow arm path from Figma */}
            <g
              style={{
                transform: `scale(-0.28, -0.28) translate(-12px, 60px) rotate(52deg)`,
                transformOrigin: '100px',
              }}
            >
              <path
                d="M6.25446 8.59289C11.9345 1.8237 22.0266 0.940755 28.7958 6.62078L65.5659 37.4746L44.9967 61.988L8.22657 31.1342C1.45737 25.4542 0.574432 15.3621 6.25446 8.59289V8.59289Z"
                fill="url(#yellowArmPath)"
              />
            </g>
            <rect
              x={CENTER_X - 1}
              y={CENTER_Y - SECOND_HAND_LENGTH}
              width={2}
              height={SECOND_HAND_LENGTH}
              fill="url(#secondHand)"
              rx={1}
              style={{ filter: 'inset 0px 0px 2px 0px rgba(0,0,0,0.2)' }}
            />
            {/* Yellow cap near base */}
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={9.6}
              fill="url(#secondHandCap)"
              filter="url(#secondHandCapShadow)"
            />
          </g>

          {/* Center cap */}
          {/* <circle cx={CENTER_X} cy={CENTER_Y} r={5} fill="#212121" /> */}

          {/* BRAUN logo - Figma style */}
          {/* <g transform={`translate(${CENTER_X - 15}, ${CENTER_Y - 28})`}>
            <text
              textAnchor="middle"
              fontSize="8"
              fontFamily="'Helvetica Neue', Arial, sans-serif"
              fill="#000"
              fontWeight="600"
            >
              BRAUN
            </text>
          </g> */}
        </svg>
      </div>
    </div>
  );
}
