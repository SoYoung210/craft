import * as RadixSlider from '@radix-ui/react-slider';

import { cn } from '../../../utils/cn';

interface Props
  extends Omit<RadixSlider.SliderProps, 'value' | 'onValueChange'> {
  width: number | string;
  height?: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
}
export function Slider(props: Props) {
  const { width, height = 30, max, value, onValueChange, className, ...restProps } = props;

  return (
    <RadixSlider.Root
      className={cn(
        'relative flex items-center select-none touch-none cursor-pointer',
        'transition-transform duration-200 ease-in-out',
        'hover:scale-y-[1.3]',
        className
      )}
      value={[value]}
      max={max}
      step={0.01}
      style={{
        width,
        height,
      }}
      onValueChange={v => onValueChange(v[0])}
      {...restProps}
    >
      <RadixSlider.Track
        className="bg-white/40 relative grow rounded-[999px] h-2"
      >
        <RadixSlider.Range
          className="absolute bg-white/80 rounded-[3px] h-full"
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
}
