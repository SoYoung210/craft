import * as RadixSlider from '@radix-ui/react-slider';

import { styled } from '../../../../stitches.config';

interface Props {
  width: number;
  height?: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
}
export function Slider(props: Props) {
  const { width, height = 3, max, value } = props;

  return (
    <SliderRoot value={[value]} max={max} step={1}>
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
  width: 200,
  height: 20,
});

const SliderTrack = styled(RadixSlider.Track, {
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '3px',
  height: 3,
});

const SliderRange = styled(RadixSlider.Range, {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '3px',
  height: '100%',
});

// const SliderThumb = styled(RadixSlider.Thumb, {
//   display: 'block',
//   width: 20,
//   height: 20,
//   backgroundColor: 'white',
//   boxShadow: `0 2px 10px ${blackA.blackA7}`,
//   borderRadius: 10,
//   '&:hover': { backgroundColor: violet.violet3 },
//   '&:focus': { outline: 'none', boxShadow: `0 0 0 5px ${blackA.blackA8}` },
// });