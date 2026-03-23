import { useCallback, useState } from 'react';

import { cn } from '../../../utils/cn';
import { colors } from '../../../utils/colors';
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
    <div
      className="w-[200px] h-[500px] origin-top"
      style={{ animation: 'bulb-swing 1s infinite ease-in-out alternate' }}
    >
      {/* Wire */}
      <div
        className="relative h-[200px] w-1"
        style={{ left: 98, backgroundColor: colors.black }}
      />
      {/* Fixture */}
      <div
        className="relative w-4 h-5 z-[1]"
        style={{ left: 92, backgroundColor: colors.gray6 }}
      >
        {/* Strips */}
        <div
          className="absolute w-[18px] h-0.5 -right-px"
          style={{ top: 6, backgroundColor: colors.gray5 }}
        />
        <div
          className="absolute w-[18px] h-0.5 -right-px"
          style={{ top: 7, backgroundColor: colors.gray5 }}
        />
        <div
          className="absolute w-[18px] h-0.5 -right-px"
          style={{ top: 10, backgroundColor: colors.gray5 }}
        />
      </div>

      {!broken && (
        <button
          type="button"
          onClick={onClickBulb}
          className={cn(
            'relative w-10 h-10 rounded-full outline-none border-none appearance-none cursor-pointer',
          )}
          style={{
            left: 80,
            bottom: 2,
            ...(theme === 'dark'
              ? { background: 'hsla(0,0%,45%,.5)' }
              : {
                  background: `linear-gradient(
                    90deg,
                    rgba(246, 234, 193, 1) 0%,
                    rgba(226, 211, 161, 0.85) 60%,
                    rgba(133, 115, 58, 1) 100%
                  )`,
                  boxShadow: `0px 0px 300px 90px rgba(235, 209, 164, 1),
                    0px 0px 300px 900px rgba(235, 209, 164, 0.09),
                    0px 0px 3000px 20px rgba(235, 209, 164, 1)`,
                  animation: 'bulb-glow 5s ease infinite',
                }),
          }}
        >
          {/* Zigs */}
          <div
            className="absolute bg-transparent w-2.5 h-[5px] rounded-[5px/2.5px] border border-black"
            style={{ top: 0, left: 15 }}
          />
          <div
            className="absolute bg-transparent w-2.5 h-[5px] rounded-[5px/2.5px] border border-black"
            style={{ top: 2, left: 15 }}
          />
          <div
            className="absolute bg-transparent w-2.5 h-[5px] rounded-[5px/2.5px] border border-black"
            style={{ top: 4, left: 15 }}
          />
        </button>
      )}
    </div>
  );
}
