export interface ClockProps {
  timeZone: string;
  label: string;
  baseTime: Date;
  onTimeAdjust: (adjustedMinutes: number) => void;
  colorScheme: 'light-blue' | 'bright-orange';
}

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
  amPm: 'AM' | 'PM';
}
