import { useCallback, useState } from 'react';

import { keyframes, styled } from '../../../../stitches.config';
import useInterval from '../../../hooks/useInterval';

interface Props {
  theme: 'dark' | 'light';
  onClickBulb?: () => void;
}
export function LightBulb({ theme, onClickBulb: onClickBulbFromProps }: Props) {
  const [clicks, setClicks] = useState(0);
  const broken = clicks > 3;

  const onClickBulb = useCallback(() => {
    onClickBulbFromProps?.();
    setClicks(prev => prev + 1);
  }, [onClickBulbFromProps]);

  useInterval(() => {
    setClicks(0);
  }, 1250);

  return (
    <Area>
      <Wire />
      <Fixture>
        <Strip />
        <Strip />
        <Strip />
      </Fixture>

      {!broken && (
        <Bulb type="button" theme={theme} onClick={onClickBulb}>
          <Zig />
          <Zig />
          <Zig />
        </Bulb>
      )}
    </Area>
  );
}

const bulbAnimation = keyframes({
  '0%': {
    backgroundPosition: '10% 0%',
  },
  '50%': {
    backgroundPosition: '91% 100%',
  },
  '100%': {
    backgroundPosition: '10% 0%',
  },
});

const Bulb = styled('button', {
  position: 'relative',
  width: '40px',
  height: '40px',
  left: '80px',
  bottom: '2px',

  borderRadius: '50%',

  outline: 'none',
  border: 'none',
  appearance: 'none',
  cursor: 'pointer',

  variants: {
    theme: {
      dark: {
        background: 'hsla(0,0%,45%,.5)',
      },
      light: {
        background: `linear-gradient(
          90deg,
          rgba(246, 234, 193, 1) 0%,
          rgba(226, 211, 161, 0.85) 60%,
          rgba(133, 115, 58, 1) 100%
        )`,
        boxShadow: `0px 0px 300px 90px rgba(235, 209, 164, 1),
        0px 0px 300px 900px rgba(235, 209, 164, 0.09),
        0px 0px 3000px 20px rgba(235, 209, 164, 1)`,
        animation: `${bulbAnimation} 5s ease infinite`,
      },
    },
  },
});

const Zig = styled('div', {
  position: 'absolute',
  backgroundColor: 'transparent',
  width: '10px',
  height: '5px',
  borderRadius: '5px / 2.5px',
  top: 0,
  left: 15,
  border: 'black solid 1px',

  '&:nth-of-type(2)': {
    top: 2,
  },
  '&:nth-of-type(3)': {
    top: 4,
  },
});

const Strip = styled('div', {
  position: 'absolute',
  width: 18,
  height: 2,
  right: -1,
  top: 6,

  bc: '$gray5',

  '&:nth-of-type(2)': {
    top: 7,
  },
  '&:nth-of-type(3)': {
    top: 10,
  },
});

const Fixture = styled('div', {
  position: 'relative',
  bc: '$gray6',
  width: '16px',
  height: '20px',
  left: '92px',
  zIndex: 1,
});

const Wire = styled('div', {
  position: 'relative',
  left: '98px',
  height: '200px',
  width: '4px',
  bc: '$black',
});

const swing = keyframes({
  from: {
    transform: 'rotate(3deg)',
  },
  to: {
    transform: 'rotate(-3deg)',
  },
});

const Area = styled('div', {
  width: '200px',
  height: '500px',
  animation: `${swing} 1s infinite ease-in-out alternate`,
  transformOrigin: 'top',
});
