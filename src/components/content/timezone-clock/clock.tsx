'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { cn } from '../../../utils/css';

import { NOISE } from './constants';
import type { ClockProps } from './types';
import { getTimeParts, get24HourFormat } from './utils';

const SVG_SIZE = 200;
const TICK_MARKS_RADIUS = 73; // Move tick marks further in
const NUMERAL_RADIUS = 54; // Move numerals further out from tick marks
const HOUR_HAND_LENGTH = 40;
const MINUTE_HAND_LENGTH = 56;
const SECOND_HAND_LENGTH = 66;
const CENTER_X = 100;
const CENTER_Y = 100;
const TRANSITION_STYLE = '0.35s cubic-bezier(0, 0, 0.58, 1)';

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
    const { hours24 } = get24HourFormat(baseTime, timeZone);
    return hours24 >= 6 && hours24 < 18;
  }, [baseTime, timeZone]);

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
        innerCircleBg: '#efefef',
        outerFrameBg:
          'radial-gradient(18% 54.28% at 10.04% 55%, rgba(0,0,0,7%) 24%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, #fff 41%, #fefefe 100%)',
        outerFrameBorder: '#E0E0E0',
        middleFrameBg: 'linear-gradient(180deg, #FFFCFC 0%, #F7F7F7 100%)',
        middleFrameBoxShadow:
          '0px 0px 0px 1px #aeaeae, inset 0px 0px 4px rgba(0, 0, 0, 0.5)',
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
        outerFrameBg: 'linear-gradient(180deg, #444444 0%, #232323 100%)',
        outerFrameBorder: '#393939',
        middleFrameBg: 'linear-gradient(180deg, #2B2B2B 0%, #393939 100%)',
        middleFrameBoxShadow:
          '0px 0px 0px 2px rgb(97,97,97), inset 0px 0px 16px 0px rgba(0,0,0,0.7)',
      };

  return (
    <div className="flex flex-col items-center relative">
      {/* AM/PM Dial at top-right */}
      <div className="absolute top-1 right-[10px] z-10">
        <AmPmDial
          isPm={amPm === 'PM'}
          isDayTime={isDayTime}
          onToggle={handleAmPmToggle}
        />
      </div>
      {/* Clock case */}
      <div
        className="w-[300px] h-[300px] items-center flex justify-center relative rounded-[20px] overflow-hidden"
        style={{
          background: theme.bodyBg,
          boxShadow: isDayTime
            ? '0px 0px 16px 0px rgba(0, 0, 0, 0.23), inset 0px 6px 10px 0px rgba(255, 255, 255, 1), inset 0px -2px 8px 0px rgba(0, 0, 0, 0.19), inset 0px 0px 8px 0px rgba(0, 0, 0, 0.12), inset 2px 3px 20px 0px rgba(255, 255, 255, 0.37)'
            : '0px 0px 16px 0px rgba(0,0,0,0.45), inset 0px 6px 10px 0px rgba(80,80,80,0.7), inset 0px -2px 8px 0px rgba(0,0,0,0.32), inset 0px 0px 8px 0px rgba(0,0,0,0.22), inset 2px 3px 20px 0px rgba(80,80,80,0.18)',
          transition: `background ${TRANSITION_STYLE}`,
        }}
      >
        {/* Outer circle frame */}
        <div
          data-name="outer-frame"
          className="absolute rounded-full inset-3"
          style={{
            background: theme.outerFrameBg,
            boxShadow: isDayTime
              ? '0px 0px 2px rgba(0, 0, 0, 0.12), inset 0px 0px 1px #FFFFFF'
              : '0px 0px 2px 0px rgba(0,0,0,0.32), inset 0px 0px 4px 0.5px #444, inset 0px 0px 0px 3.5px #232323',
            border: `1px solid ${theme.outerFrameBorder}`,
            transition: `background ${TRANSITION_STYLE}, border ${TRANSITION_STYLE}`,
          }}
        />
        {/* Middle circle frame */}
        <div
          data-name="middle-frame"
          className="absolute inset-6 rounded-full"
          style={{
            background: theme.middleFrameBg,
            boxShadow: theme.middleFrameBoxShadow,
            transition: `background ${TRANSITION_STYLE}, box-shadow ${TRANSITION_STYLE}`,
          }}
        />
        {/* Inner circle frame */}
        <div className="relative w-[258px] h-[258px]">
          <div
            data-name="inner-frame"
            className="absolute overflow-hidden w-[244px] h-[244px] inset-[7px] rounded-full border-2"
            style={{
              background: theme.innerCircleBg,
              borderColor: 'rgba(0,0,0,0.22)',
              boxShadow: isDayTime
                ? 'inset 0px -2px 3px rgba(255, 255, 255, 0.938593), inset 0px 0px 3px rgba(0, 0, 0, 0.314002), inset 0px 0px 0px 3px #D2CFCF'
                : 'inset 0px 0px 0px 8px #232323, inset 0px 0px 32px 0px rgba(0,0,0,0.44), inset 0px -9px 3px 0px rgba(255,255,255,0.12)',
              transition: `background ${TRANSITION_STYLE}`,
            }}
          >
            <div
              data-name="inner-frame-half-right"
              className={cn(
                'absolute right-0 top-1 w-[120px] h-[244px] ',
                isDayTime ? 'bg-black/[0.04]' : 'bg-black/[0.14]'
              )}
            />
          </div>
          <div
            className="inset-0"
            style={{
              position: 'absolute',
              borderRadius: 999,
              width: 258,
              height: 258,
              pointerEvents: 'none',
              backgroundImage: NOISE,
              opacity: 0.03,
            }}
          />
        </div>

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
                  filter: isDayTime
                    ? 'drop-shadow(1px 1px 0px #E2E2E2)'
                    : undefined,
                  opacity: isHourMark ? 1 : 0.7,
                  transition: `stroke ${TRANSITION_STYLE}`,
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
                  filter: `drop-shadow(0px 2px 0px ${
                    isDayTime ? 'rgba(219, 219, 219, 0.24)' : 'rgba(0,0,0,0.8)'
                  })`,
                  userSelect: 'none',
                  transition: `fill ${TRANSITION_STYLE}`,
                }}
              >
                {hourValue}
              </text>
            );
          })}

          <g
            transform={`translate(${CENTER_X}, ${
              CENTER_Y - 28
            }) scale(1.14, 1.18)`}
          >
            <text
              textAnchor="middle"
              fontSize="9.6"
              fontFamily="'Berthold Akzidenz Grotesk BE', Arial, sans-serif"
              fill={isDayTime ? '#000' : '#fff'}
              fontWeight="600"
              letterSpacing="0.03em"
            >
              {label}
            </text>
          </g>

          {/* Black hour hand - fit inside numeral area */}
          <g
            transform={`rotate(${hourHandRotation}, ${CENTER_X}, ${CENTER_Y})`}
            style={{ filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.25))' }}
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
                transition: `fill ${TRANSITION_STYLE}`,
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
              // x="-30%"
              // y="-30%"
              width="110%"
              height="110%"
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
            style={{ filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.25))' }}
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
                transition: `fill ${TRANSITION_STYLE}`,
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
        </svg>
      </div>
    </div>
  );
}

// Add AmPmDial component for AM/PM toggle using the provided SVG
function AmPmDial({
  isPm,
  isDayTime,
  onToggle,
}: {
  isPm: boolean;
  isDayTime: boolean;
  onToggle: () => void;
}) {
  // The dial rotates the red dot to AM (up) or PM (down)
  return (
    <button
      aria-label="Toggle AM/PM"
      onClick={onToggle}
      style={{
        background: 'none',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: 0,
        width: 38,
        display: 'block',
      }}
    >
      <div
        className="text-[8px]"
        style={{
          color: '#888',
          textAlign: 'center',
        }}
      >
        <span>AM</span>
      </div>
      <svg
        // width="88"
        // height="110"
        viewBox="0 0 88 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: isPm ? 'rotate(180deg)' : undefined,
          transformOrigin: 'center 40%',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {isDayTime ? (
          <>
            {' '}
            <g filter="url(#filter0_i_968_512)">
              <circle
                cx="44"
                cy="44"
                r="44"
                fill="url(#paint0_linear_968_512)"
              />
            </g>
            <circle cx="44.5" cy="44.5" r="39.5" fill="#444444" />
            <g opacity="0.6" filter="url(#filter1_f_968_512)">
              <path
                d="M39 82L35 83.3333L36.7645 91.9597C37.4836 95.4754 40.5768 98 44.1653 98C47.8611 98 51.0142 95.326 51.6179 91.68L53 83.3333L49.5714 82H39Z"
                fill="url(#paint1_linear_968_512)"
              />
            </g>
            <mask id="path-4-inside-1_968_512" fill="white">
              <path d="M44.3086 2.60645C46.8821 2.60654 49.2121 3.64393 50.907 5.32201C51.2316 5.64339 51.6367 5.87911 52.0849 5.96727C70.241 9.53862 83.9248 25.3721 83.9248 44.3643C83.9247 61.8566 72.3168 76.6698 56.2979 81.6904C55.5613 81.9213 54.9982 81.9956 54.5676 81.9742C53.4645 81.9196 52.2747 80.8281 51.1702 80.8281H37.9673C36.8629 80.8281 35.6863 81.907 34.5883 82.0254C34.0599 82.0823 33.3291 82.0072 32.3184 81.6904C16.2994 76.6698 4.69155 61.8566 4.69141 44.3643C4.69141 25.3722 18.3752 9.53864 36.5313 5.96728C36.9795 5.87912 37.3846 5.64338 37.7092 5.322C39.4042 3.64379 41.7349 2.60645 44.3086 2.60645Z" />
            </mask>
            <g filter="url(#filter2_ii_968_512)">
              <path
                d="M44.3086 2.60645C46.8821 2.60654 49.2121 3.64393 50.907 5.32201C51.2316 5.64339 51.6367 5.87911 52.0849 5.96727C70.241 9.53862 83.9248 25.3721 83.9248 44.3643C83.9247 61.8566 72.3168 76.6698 56.2979 81.6904C55.5613 81.9213 54.9982 81.9956 54.5676 81.9742C53.4645 81.9196 52.2747 80.8281 51.1702 80.8281H37.9673C36.8629 80.8281 35.6863 81.907 34.5883 82.0254C34.0599 82.0823 33.3291 82.0072 32.3184 81.6904C16.2994 76.6698 4.69155 61.8566 4.69141 44.3643C4.69141 25.3722 18.3752 9.53864 36.5313 5.96728C36.9795 5.87912 37.3846 5.64338 37.7092 5.322C39.4042 3.64379 41.7349 2.60645 44.3086 2.60645Z"
                fill="#E8E8E8"
              />
              <path
                d="M44.3086 2.60645C46.8821 2.60654 49.2121 3.64393 50.907 5.32201C51.2316 5.64339 51.6367 5.87911 52.0849 5.96727C70.241 9.53862 83.9248 25.3721 83.9248 44.3643C83.9247 61.8566 72.3168 76.6698 56.2979 81.6904C55.5613 81.9213 54.9982 81.9956 54.5676 81.9742C53.4645 81.9196 52.2747 80.8281 51.1702 80.8281H37.9673C36.8629 80.8281 35.6863 81.907 34.5883 82.0254C34.0599 82.0823 33.3291 82.0072 32.3184 81.6904C16.2994 76.6698 4.69155 61.8566 4.69141 44.3643C4.69141 25.3722 18.3752 9.53864 36.5313 5.96728C36.9795 5.87912 37.3846 5.64338 37.7092 5.322C39.4042 3.64379 41.7349 2.60645 44.3086 2.60645Z"
                fill="url(#paint2_linear_968_512)"
              />
              <path
                d="M44.3086 2.60645C46.8821 2.60654 49.2121 3.64393 50.907 5.32201C51.2316 5.64339 51.6367 5.87911 52.0849 5.96727C70.241 9.53862 83.9248 25.3721 83.9248 44.3643C83.9247 61.8566 72.3168 76.6698 56.2979 81.6904C55.5613 81.9213 54.9982 81.9956 54.5676 81.9742C53.4645 81.9196 52.2747 80.8281 51.1702 80.8281H37.9673C36.8629 80.8281 35.6863 81.907 34.5883 82.0254C34.0599 82.0823 33.3291 82.0072 32.3184 81.6904C16.2994 76.6698 4.69155 61.8566 4.69141 44.3643C4.69141 25.3722 18.3752 9.53864 36.5313 5.96728C36.9795 5.87912 37.3846 5.64338 37.7092 5.322C39.4042 3.64379 41.7349 2.60645 44.3086 2.60645Z"
                fill="url(#paint3_linear_968_512)"
              />
            </g>
            <path
              d="M44.3086 2.60645L44.3087 0.606445H44.3086V2.60645ZM83.9248 44.3643L85.9248 44.3643V44.3643H83.9248ZM56.2979 81.6904L56.896 83.5989L56.896 83.5989L56.2979 81.6904ZM32.3184 81.6904L31.7202 83.5989L31.7202 83.5989L32.3184 81.6904ZM4.69141 44.3643L2.69141 44.3643L2.69141 44.3643L4.69141 44.3643ZM36.5313 5.96728L36.1453 4.00488L36.5313 5.96728ZM37.7092 5.322L39.1163 6.74325L37.7092 5.322ZM34.5883 82.0254L34.374 80.0369L34.5883 82.0254ZM54.5676 81.9742L54.6666 79.9767L54.5676 81.9742ZM50.907 5.32201L49.4999 6.74325L50.907 5.32201ZM44.3086 2.60645L44.3085 4.60645C46.3331 4.60652 48.1636 5.42019 49.4999 6.74325L50.907 5.32201L52.3142 3.90078C50.2607 1.86767 47.4311 0.606563 44.3087 0.606445L44.3086 2.60645ZM52.0849 5.96727L51.6989 7.92967C68.9514 11.3233 81.9248 26.3624 81.9248 44.3643H83.9248H85.9248C85.9248 24.3819 71.5305 7.75395 52.4709 4.00488L52.0849 5.96727ZM83.9248 44.3643L81.9248 44.3642C81.9247 60.9445 70.9213 75.0112 55.6997 79.782L56.2979 81.6904L56.896 83.5989C73.7123 78.3283 85.9247 62.7687 85.9248 44.3643L83.9248 44.3643ZM56.2979 81.6904L55.6997 79.782C55.111 79.9665 54.792 79.9829 54.6666 79.9767L54.5676 81.9742L54.4687 83.9718C55.2043 84.0082 56.0116 83.8761 56.896 83.5989L56.2979 81.6904ZM51.1702 80.8281V78.8281H37.9673V80.8281V82.8281H51.1702V80.8281ZM34.5883 82.0254L34.374 80.0369C34.2117 80.0544 33.7715 80.0499 32.9165 79.782L32.3184 81.6904L31.7202 83.5989C32.8867 83.9645 33.9081 84.1103 34.8027 84.0138L34.5883 82.0254ZM32.3184 81.6904L32.9165 79.782C17.6949 75.0112 6.69154 60.9445 6.69141 44.3642L4.69141 44.3643L2.69141 44.3643C2.69156 62.7687 14.9039 78.3283 31.7202 83.5989L32.3184 81.6904ZM4.69141 44.3643H6.69141C6.69141 26.3624 19.6648 11.3233 36.9173 7.92967L36.5313 5.96728L36.1453 4.00488C17.0857 7.75397 2.69141 24.3819 2.69141 44.3643H4.69141ZM37.7092 5.322L39.1163 6.74325C40.4527 5.42016 42.2837 4.60645 44.3086 4.60645V2.60645V0.606445C41.1861 0.606445 38.3558 1.86742 36.3021 3.90075L37.7092 5.322ZM36.5313 5.96728L36.9173 7.92967C37.8059 7.75488 38.554 7.29996 39.1163 6.74325L37.7092 5.322L36.3021 3.90075C36.2152 3.9868 36.1531 4.00335 36.1453 4.00488L36.5313 5.96728ZM37.9673 80.8281V78.8281C36.8635 78.8281 35.8691 79.3496 35.3815 79.5932C35.0642 79.7518 34.8564 79.8581 34.6533 79.9429C34.5607 79.9816 34.4919 80.0058 34.4413 80.0206C34.3911 80.0353 34.3706 80.0373 34.374 80.0369L34.5883 82.0254L34.8027 84.0138C35.7938 83.907 36.7358 83.3881 37.1693 83.1715C37.4562 83.0282 37.6489 82.9373 37.8123 82.8778C37.9723 82.8195 38.0091 82.8281 37.9673 82.8281V80.8281ZM54.5676 81.9742L54.6666 79.9767C54.6896 79.9778 54.6329 79.9783 54.4493 79.9072C54.2607 79.8341 54.0575 79.735 53.7463 79.5831C53.2762 79.3539 52.2706 78.8281 51.1702 78.8281V80.8281V82.8281C51.126 82.8281 51.1629 82.819 51.3292 82.8794C51.4994 82.9412 51.6951 83.0331 51.9926 83.1782C52.4382 83.3956 53.4192 83.9198 54.4687 83.9718L54.5676 81.9742ZM50.907 5.32201L49.4999 6.74325C50.0622 7.29999 50.8103 7.75488 51.6989 7.92967L52.0849 5.96727L52.4709 4.00488C52.4631 4.00334 52.4011 3.98679 52.3142 3.90078L50.907 5.32201Z"
              fill="#464646"
              mask="url(#path-4-inside-1_968_512)"
            />
            <g opacity="0.9" filter="url(#filter3_di_968_512)">
              <ellipse cx="44.5" cy="13" rx="2.5" ry="2" fill="#D73534" />
            </g>
            <defs>
              <filter
                id="filter0_i_968_512"
                x="0"
                y="0"
                width="88"
                height="98"
                filterUnits="userSpaceOnUse"
                // colorInterpolationFilters="sRGB"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="4"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_innerShadow_968_512"
                />
                <feOffset dy="10" />
                <feGaussianBlur stdDeviation="3" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_968_512"
                />
              </filter>
              <filter
                id="filter1_f_968_512"
                x="23"
                y="70"
                width="42"
                height="40"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="6"
                  result="effect1_foregroundBlur_968_512"
                />
              </filter>
              <filter
                id="filter2_ii_968_512"
                x="4.69141"
                y="2.60645"
                width="79.2344"
                height="81.4365"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="6" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_968_512"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-4" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.975 0 0 0 0 0.961188 0 0 0 0 0.934375 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_innerShadow_968_512"
                  result="effect2_innerShadow_968_512"
                />
              </filter>
              <filter
                id="filter3_di_968_512"
                x="42"
                y="11"
                width="5"
                height="6"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.975 0 0 0 0 0.961188 0 0 0 0 0.934375 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_968_512"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_968_512"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect2_innerShadow_968_512"
                />
              </filter>
              <linearGradient
                id="paint0_linear_968_512"
                x1="44"
                y1="20.1667"
                x2="44"
                y2="57.3571"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D3D3D3" />
                <stop offset="1" stopColor="#FCFAF6" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_968_512"
                x1="44.4286"
                y1="82"
                x2="44.4286"
                y2="98"
                gradientUnits="userSpaceOnUse"
              >
                <stop />
                <stop offset="1" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_968_512"
                x1="53.1697"
                y1="42.4078"
                x2="66.9835"
                y2="42.4078"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EAEAEA" />
                <stop offset="0.0001" stopColor="white" stopOpacity="0.8" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_968_512"
                x1="35.4465"
                y1="42.4078"
                x2="4.69141"
                y2="42.3977"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EBEBEB" stopOpacity="0" />
                <stop offset="0.0001" stopColor="#7F7F7F" stopOpacity="0.66" />
                <stop offset="1" stopColor="#808080" stopOpacity="0" />
              </linearGradient>
            </defs>
          </>
        ) : (
          <>
            <g clipPath="url(#clip0_976_1204)">
              <g filter="url(#filter0_i_976_1204)">
                <circle
                  cx="44"
                  cy="44"
                  r="44"
                  fill="url(#paint0_linear_976_1204)"
                />
              </g>
              <ellipse cx="44" cy="44.5" rx="40" ry="39.5" fill="#0D0B12" />
              <g opacity="0.8" filter="url(#filter1_f_976_1204)">
                <path
                  d="M39 82L35 83.3333L36.7645 91.9597C37.4836 95.4754 40.5768 98 44.1653 98C47.8611 98 51.0142 95.326 51.6179 91.68L53 83.3333L49.5714 82H39Z"
                  fill="url(#paint1_linear_976_1204)"
                />
              </g>
              <mask id="path-4-inside-1_976_1204" fill="white">
                <path d="M44.334 2.6084C46.641 2.6084 48.7526 3.44134 50.3868 4.82209C51.08 5.40777 51.876 5.88218 52.7634 6.07205C70.6076 9.8901 83.9756 25.5822 83.9756 44.3594C83.9754 61.862 72.3605 76.6835 56.332 81.707V81.707C54.3493 82.3284 51.518 80.8447 49.4403 80.8447H44.3711C44.3588 80.8448 44.3463 80.8457 44.334 80.8457C44.3216 80.8457 44.3092 80.8448 44.2969 80.8447H39.9908C37.7814 80.8447 34.7635 82.3948 32.637 81.7956C32.5407 81.7684 32.4417 81.739 32.3398 81.707C16.3114 76.6835 4.69545 61.862 4.69531 44.3594C4.69531 25.5838 18.0616 9.89295 35.9035 6.0732C36.7909 5.88321 37.587 5.40867 38.2801 4.82286C39.9145 3.44162 42.0265 2.60842 44.334 2.6084Z" />
              </mask>
              <g filter="url(#filter2_ii_976_1204)">
                <path
                  d="M44.334 2.6084C46.641 2.6084 48.7526 3.44134 50.3868 4.82209C51.08 5.40777 51.876 5.88218 52.7634 6.07205C70.6076 9.8901 83.9756 25.5822 83.9756 44.3594C83.9754 61.862 72.3605 76.6835 56.332 81.707V81.707C54.3493 82.3284 51.518 80.8447 49.4403 80.8447H44.3711C44.3588 80.8448 44.3463 80.8457 44.334 80.8457C44.3216 80.8457 44.3092 80.8448 44.2969 80.8447H39.9908C37.7814 80.8447 34.7635 82.3948 32.637 81.7956C32.5407 81.7684 32.4417 81.739 32.3398 81.707C16.3114 76.6835 4.69545 61.862 4.69531 44.3594C4.69531 25.5838 18.0616 9.89295 35.9035 6.0732C36.7909 5.88321 37.587 5.40867 38.2801 4.82286C39.9145 3.44162 42.0265 2.60842 44.334 2.6084Z"
                  fill="#3C3A41"
                />
                <path
                  d="M44.334 2.6084C46.641 2.6084 48.7526 3.44134 50.3868 4.82209C51.08 5.40777 51.876 5.88218 52.7634 6.07205C70.6076 9.8901 83.9756 25.5822 83.9756 44.3594C83.9754 61.862 72.3605 76.6835 56.332 81.707V81.707C54.3493 82.3284 51.518 80.8447 49.4403 80.8447H44.3711C44.3588 80.8448 44.3463 80.8457 44.334 80.8457C44.3216 80.8457 44.3092 80.8448 44.2969 80.8447H39.9908C37.7814 80.8447 34.7635 82.3948 32.637 81.7956C32.5407 81.7684 32.4417 81.739 32.3398 81.707C16.3114 76.6835 4.69545 61.862 4.69531 44.3594C4.69531 25.5838 18.0616 9.89295 35.9035 6.0732C36.7909 5.88321 37.587 5.40867 38.2801 4.82286C39.9145 3.44162 42.0265 2.60842 44.334 2.6084Z"
                  fill="url(#paint2_linear_976_1204)"
                />
                <path
                  d="M44.334 2.6084C46.641 2.6084 48.7526 3.44134 50.3868 4.82209C51.08 5.40777 51.876 5.88218 52.7634 6.07205C70.6076 9.8901 83.9756 25.5822 83.9756 44.3594C83.9754 61.862 72.3605 76.6835 56.332 81.707V81.707C54.3493 82.3284 51.518 80.8447 49.4403 80.8447H44.3711C44.3588 80.8448 44.3463 80.8457 44.334 80.8457C44.3216 80.8457 44.3092 80.8448 44.2969 80.8447H39.9908C37.7814 80.8447 34.7635 82.3948 32.637 81.7956C32.5407 81.7684 32.4417 81.739 32.3398 81.707C16.3114 76.6835 4.69545 61.862 4.69531 44.3594C4.69531 25.5838 18.0616 9.89295 35.9035 6.0732C36.7909 5.88321 37.587 5.40867 38.2801 4.82286C39.9145 3.44162 42.0265 2.60842 44.334 2.6084Z"
                  fill="url(#paint3_linear_976_1204)"
                />
              </g>
              <path
                d="M44.334 2.6084L44.334 0.608398L44.334 0.608398L44.334 2.6084ZM83.9756 44.3594L85.9756 44.3594V44.3594H83.9756ZM44.3711 80.8447L44.3711 78.8447L44.3634 78.8447L44.3711 80.8447ZM44.334 80.8457L44.334 82.8457H44.334V80.8457ZM44.2969 80.8447L44.3046 78.8447H44.2969V80.8447ZM32.3398 81.707L31.7417 83.6155L31.7418 83.6155L32.3398 81.707ZM4.69531 44.3594L2.69531 44.3594L2.69531 44.3594L4.69531 44.3594ZM32.637 81.7956L32.0945 83.7206L32.637 81.7956ZM38.2801 4.82286L36.9892 3.29533L38.2801 4.82286ZM50.3868 4.82209L49.096 6.34979L50.3868 4.82209ZM52.7634 6.07205L52.345 8.02778L52.7634 6.07205ZM44.334 2.6084V4.6084C46.1505 4.6084 47.8088 5.26221 49.096 6.34979L50.3868 4.82209L51.6776 3.29439C49.6964 1.62047 47.1315 0.608398 44.334 0.608398V2.6084ZM52.7634 6.07205L52.345 8.02778C69.3015 11.6559 81.9756 26.5606 81.9756 44.3594H83.9756H85.9756C85.9756 24.6037 71.9136 8.12429 53.1819 4.11632L52.7634 6.07205ZM83.9756 44.3594L81.9756 44.3594C81.9755 60.9498 70.965 75.025 55.7339 79.7986L56.332 81.707L56.9302 83.6155C73.7559 78.3421 85.9754 62.7741 85.9756 44.3594L83.9756 44.3594ZM49.4403 80.8447V78.8447H44.3711V80.8447V82.8447H49.4403V80.8447ZM44.3711 80.8447L44.3634 78.8447C44.337 78.8448 44.3152 78.8454 44.3012 78.8458C44.294 78.846 44.288 78.8462 44.2839 78.8464C44.2801 78.8465 44.2764 78.8467 44.2757 78.8467C44.2741 78.8468 44.275 78.8467 44.2765 78.8467C44.2782 78.8466 44.2818 78.8465 44.2865 78.8464C44.2957 78.8461 44.3125 78.8457 44.334 78.8457V80.8457V82.8457C44.3616 82.8457 44.3846 82.8452 44.4 82.8448C44.4145 82.8443 44.4271 82.8438 44.4294 82.8438C44.4349 82.8435 44.4291 82.8438 44.4225 82.844C44.4146 82.8442 44.399 82.8446 44.3788 82.8447L44.3711 80.8447ZM44.334 80.8457L44.334 78.8457C44.3554 78.8457 44.3722 78.8461 44.3815 78.8464C44.3862 78.8465 44.3898 78.8466 44.3915 78.8467C44.393 78.8467 44.3939 78.8468 44.3924 78.8467C44.3916 78.8467 44.3879 78.8465 44.3841 78.8464C44.38 78.8463 44.374 78.846 44.3668 78.8458C44.3527 78.8454 44.3309 78.8448 44.3046 78.8447L44.2969 80.8447L44.2891 82.8447C44.269 82.8446 44.2534 82.8442 44.2455 82.844C44.2388 82.8438 44.233 82.8435 44.2385 82.8438C44.2408 82.8438 44.2534 82.8443 44.2679 82.8448C44.2834 82.8452 44.3064 82.8457 44.334 82.8457L44.334 80.8457ZM44.2969 80.8447V78.8447H39.9908V80.8447V82.8447H44.2969V80.8447ZM32.637 81.7956L33.1795 79.8705C33.1025 79.8488 33.022 79.8249 32.9379 79.7985L32.3398 81.707L31.7418 83.6155C31.8614 83.653 31.979 83.688 32.0945 83.7206L32.637 81.7956ZM32.3398 81.707L32.938 79.7986C17.7068 75.0249 6.69545 60.9498 6.69531 44.3594L4.69531 44.3594L2.69531 44.3594C2.69546 62.7742 14.916 78.3421 31.7417 83.6155L32.3398 81.707ZM4.69531 44.3594H6.69531C6.69531 26.5622 19.3678 11.6586 36.3222 8.02889L35.9035 6.0732L35.4848 4.11752C16.7555 8.12726 2.69531 24.6054 2.69531 44.3594H4.69531ZM38.2801 4.82286L39.5711 6.35039C40.8584 5.26246 42.5171 4.60841 44.334 4.6084L44.334 2.6084L44.334 0.608398C41.5359 0.608423 38.9705 1.62078 36.9892 3.29533L38.2801 4.82286ZM39.9908 80.8447V78.8447C38.5752 78.8447 36.916 79.3349 35.814 79.6006C34.465 79.9259 33.6715 80.0092 33.1795 79.8705L32.637 81.7956L32.0945 83.7206C33.729 84.1812 35.5077 83.7891 36.7517 83.4891C38.2426 83.1296 39.197 82.8447 39.9908 82.8447V80.8447ZM56.332 81.707L55.7339 79.7986C55.3403 79.9219 54.6569 79.8702 53.3909 79.5647C52.3827 79.3214 50.7916 78.8447 49.4403 78.8447V80.8447V82.8447C50.1667 82.8447 51.0302 83.1099 52.4527 83.4531C53.6175 83.7341 55.3411 84.1135 56.9302 83.6155L56.332 81.707ZM35.9035 6.0732L36.3222 8.02889C37.6338 7.74808 38.7216 7.06837 39.5711 6.35039L38.2801 4.82286L36.9892 3.29533C36.4524 3.74897 35.948 4.01835 35.4848 4.11752L35.9035 6.0732ZM50.3868 4.82209L49.096 6.34979C49.9456 7.06763 51.0334 7.74714 52.345 8.02778L52.7634 6.07205L53.1819 4.11632C52.7187 4.01721 52.2143 3.74791 51.6776 3.29439L50.3868 4.82209Z"
                fill="#0D0B12"
                mask="url(#path-4-inside-1_976_1204)"
              />
              <g opacity="0.9" filter="url(#filter3_di_976_1204)">
                <ellipse cx="45" cy="8.5" rx="2" ry="2.5" fill="#DF2526" />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_i_976_1204"
                x="0"
                y="0"
                width="88"
                height="98"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="4"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_innerShadow_976_1204"
                />
                <feOffset dy="10" />
                <feGaussianBlur stdDeviation="3" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_976_1204"
                />
              </filter>
              <filter
                id="filter1_f_976_1204"
                x="23"
                y="70"
                width="42"
                height="40"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="6"
                  result="effect1_foregroundBlur_976_1204"
                />
              </filter>
              <filter
                id="filter2_ii_976_1204"
                x="4.69531"
                y="0.608398"
                width="79.2812"
                height="83.3247"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="6" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.396078 0 0 0 0 0.392157 0 0 0 0 0.403922 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_976_1204"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-4" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.395747 0 0 0 0 0.390694 0 0 0 0 0.404167 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_innerShadow_976_1204"
                  result="effect2_innerShadow_976_1204"
                />
              </filter>
              <filter
                id="filter3_di_976_1204"
                x="43"
                y="6"
                width="4"
                height="7"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.32549 0 0 0 0 0.321569 0 0 0 0 0.341176 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_976_1204"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_976_1204"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect2_innerShadow_976_1204"
                />
              </filter>
              <linearGradient
                id="paint0_linear_976_1204"
                x1="44"
                y1="20.1667"
                x2="44"
                y2="60.7619"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0D0B12" />
                <stop offset="0.0001" stopColor="#1C1A26" />
                <stop offset="1" stopColor="#4D4B52" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_976_1204"
                x1="44.4286"
                y1="82"
                x2="44.4286"
                y2="98"
                gradientUnits="userSpaceOnUse"
              >
                <stop />
                <stop offset="1" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_976_1204"
                x1="53.2023"
                y1="42.3693"
                x2="67.5458"
                y2="42.3693"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3C3A41" stopOpacity="0" />
                <stop offset="0.0001" stopColor="#5A5A5E" stopOpacity="0.55" />
                <stop offset="1" stopColor="#5A5A5E" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_976_1204"
                x1="35.4686"
                y1="42.3594"
                x2="4.69531"
                y2="42.3594"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3C3A41" stopOpacity="0" />
                <stop offset="0.0001" stopColor="#25252D" />
                <stop offset="1" stopColor="#25252D" stopOpacity="0" />
              </linearGradient>
              <clipPath id="clip0_976_1204">
                <rect width="88" height="110" fill="white" />
              </clipPath>
            </defs>
          </>
        )}
      </svg>
      <div
        className="text-[8px]"
        style={{
          color: '#888',
          textAlign: 'center',
          marginTop: -10,
        }}
      >
        <span>PM</span>
      </div>
    </button>
  );
}
