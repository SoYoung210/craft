import * as RadixSlider from '@radix-ui/react-slider';

import { styled } from '../../../../stitches.config';

interface Props
  extends Omit<RadixSlider.SliderProps, 'value' | 'onValueChange'> {
  width: number | string;
  height?: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
}
export function Slider(props: Props) {
  const { width, height = 30, max, value, onValueChange, ...restProps } = props;

  return (
    <SliderRoot
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
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
    </SliderRoot>
  );
}

const SliderRoot = styled(RadixSlider.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',

  '&:hover': {
    transform: 'scaleY(1.3)',
  },
});

const SliderTrack = styled(RadixSlider.Track, {
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '999px',
  height: 8,
});

const SliderRange = styled(RadixSlider.Range, {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '3px',
  height: '100%',
});
