import type { TimeParts } from './types';

export function getTimeParts(date: Date, timeZone: string): TimeParts {
  const formatterHour12 = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    hour12: true,
  });

  const parts = formatterHour12.formatToParts(date);
  const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minutes = parseInt(
    parts.find(p => p.type === 'minute')?.value || '0',
    10
  );
  const seconds = parseInt(
    parts.find(p => p.type === 'second')?.value || '0',
    10
  );
  const amPm =
    (parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() as
      | 'AM'
      | 'PM') || 'AM';

  return { hours, minutes, seconds, amPm };
}

export function get24HourFormat(
  date: Date,
  timeZone: string
): { hours24: number; minutes: number; seconds: number } {
  const formatter24Hour = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    hour12: false, // Key for 24-hour format
  });

  const parts = formatter24Hour.formatToParts(date);
  const hoursString = parts.find(p => p.type === 'hour')?.value || '0';
  // Intl API might return "24" for midnight in some locales with hourCycle h24. Convert to 0.
  const hours24 = parseInt(hoursString, 10) % 24;
  const minutes = parseInt(
    parts.find(p => p.type === 'minute')?.value || '0',
    10
  );
  const seconds = parseInt(
    parts.find(p => p.type === 'second')?.value || '0',
    10
  );

  return { hours24, minutes, seconds };
}
