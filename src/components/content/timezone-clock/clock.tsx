'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { cn } from '../../../utils/css';

import { NOISE } from './constants';
import type { ClockProps } from './types';
import { getTimeParts, get24HourFormat } from './utils';
import { AmPmDial } from './AmPmDial';

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
  const dragAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // TODO: refactor, doesn't look like need react state
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragAudioRef.current && (isDraggingHour || isDraggingMinute)) {
        // dragAudioRef.current.currentTime = 0;
        dragAudioRef.current.play();
      }
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
    if (dragAudioRef.current) {
      dragAudioRef.current.currentTime = 0;
      dragAudioRef.current.pause();
    }
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
    <div className="flex flex-col items-center">
      <audio ref={dragAudioRef} src="/audio/tick-short.mp3" preload="auto" />
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
        {/* AM/PM Dial at top-right */}
        <div className="absolute top-1 right-[10px] z-10">
          <AmPmDial
            isPm={amPm === 'PM'}
            isDayTime={isDayTime}
            onToggle={handleAmPmToggle}
          />
        </div>
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
              x1="-0.131678"
              y1="1.57511"
              x2="1.23973"
              y2="8.85491"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.14912" stopColor="#FFAC00" />
              <stop offset="1" stopColor="#FF970B" />
            </linearGradient>
            <filter
              id="secondHandCapShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
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
              <feOffset />
              <feGaussianBlur stdDeviation="1.2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.224978 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_898_125"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_898_125"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-3" dy="2.5" />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.377977 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect2_innerShadow_898_125"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="1.2" dy="1.2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.818639 0 0 0 0 0.220465 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_898_125"
                result="effect3_innerShadow_898_125"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="3.5" />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0620903 0"
              />
              <feBlend
                mode="normal"
                in2="effect3_innerShadow_898_125"
                result="effect4_innerShadow_898_125"
              />
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
