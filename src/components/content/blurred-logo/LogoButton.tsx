import { ReactElement } from 'react';

import { cn } from '../../../utils/cn';

// layer stacking
interface Props {
  logo: ReactElement;
}
export default function LogoButton({ logo }: Props) {
  return (
    <button
      className={cn(
        'bg-transparent border-0 relative',
        'w-[200px] h-[200px] rounded-[48px]',
        'will-change-transform transition-[filter] duration-150 ease-linear',
        'flex items-center justify-center'
      )}
    >
      {/* BottomLayer1 */}
      <div
        className="flex items-center justify-center absolute pointer-events-none select-none w-full h-full -z-[1] left-0 [&_svg]:w-[54%] [&_svg]:h-[54%] [&_svg]:z-[2]"
        style={{ bottom: -48, filter: 'blur(45px) opacity(0.7)' }}
      >
        {logo}
      </div>
      {/* Content */}
      <div className="overflow-hidden w-full h-full relative rounded-[inherit]">
        {/* HighlightBar left */}
        <div
          className="absolute h-[70%] z-[2] bg-white w-2.5"
          style={{ filter: 'blur(5px)', opacity: 0.3, top: 32, left: 16 }}
        />
        {/* HighlightBar right */}
        <div
          className="absolute h-[70%] z-[2] bg-white w-2.5"
          style={{ filter: 'blur(5px)', opacity: 0.3, top: 32, right: 16 }}
        />
        {/* BottomLayer2 */}
        <div
          className="flex items-center justify-center absolute pointer-events-none select-none w-full h-full -z-[1] left-0 [&_svg]:w-[54%] [&_svg]:h-[54%] [&_svg]:z-[2]"
          style={{
            bottom: -12,
            transform: 'scale(0.5)',
            filter: 'blur(20px) opacity(0.7)',
          }}
        >
          {logo}
        </div>
        {/* BgLayer1 */}
        <div
          className="flex items-center justify-center absolute pointer-events-none select-none w-full h-full top-0 left-0 [&_svg]:w-full [&_svg]:h-full [&_svg]:z-[2]"
          style={{
            transform: 'scale(2)',
            filter: 'blur(20px) opacity(0.3) saturate(250%)',
          }}
        >
          {logo}
        </div>
        {/* BgLayer2 */}
        <div
          className="flex items-center justify-center absolute pointer-events-none select-none w-full !h-1/2 bottom-0 left-0 [&_svg]:w-[54%] [&_svg]:h-[54%] [&_svg]:z-[2]"
          style={{
            transform: 'scale(2.4)',
            filter: 'blur(15px) opacity(0.1) brightness(20%)',
          }}
        >
          {logo}
        </div>
        {/* ContentLayer */}
        <div className="flex items-center justify-center w-full h-full [&_svg]:w-1/2 [&_svg]:h-1/2 [&_svg]:z-[2]">
          {logo}
        </div>
      </div>
    </button>
  );
}
