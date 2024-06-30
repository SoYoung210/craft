import {
  Children,
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Key } from 'w3c-keys';

import { styled } from '../../../../stitches.config';
import useHotKey from '../../../hooks/useHotKey';

import { RadialMenuItemProvider, useRadialMenuItemContext } from './context';
import { InnerCircle, Shadow } from './StyleUtils';
import { CURSOR, SIZE } from './constants';

interface RadialMenuProps {
  children: ReactNode;
}

/**
 * WorkLog
 * 2024-06-30 TODO
 * - [x] 위치가 변경될 때 mount/unmount animation (아주 약한 스프링. 약간 돌면서 opacity + scale?)
 * - [x] 마우스를 때면 선택된 아이템 정보를 담은 콜백을 실행할 것
 * - [] 처음엔 그냥 나오고, A를 누르고 클릭하면 커서를 바꾸고, 그 위치에 나오도록
 * - [] refactor: 계산식
 */

/**
 * TODO: 기능
 * - [x] 누르고 있을 때 원 범위 벗어나서도 선택된 아이템 바뀌는 것...
 * - [x] 초기 떠있는 위치가 있고, 마우스를 클릭했을 때 그 위치에 다시 그려지면서
 * - [x] 마우스 움직임 따라 path가 그려지는 것
 * - [x] 마우스를 때면 선택된 아이템 정보를 담은 콜백을 실행할 것
 * - [x] 활성아이템 dot은 진하게, 사진은 grey filter 해제
 * - [] 마우스 움직임에 따라 지정된 아이템 이름 보여주기
 * - [] (detail) dynamic card effect
 * - [] 처음엔 그냥 나오고, A를 누르고 클릭하면 커서를 바꾸고, 그 위치에 나오도록

 */

/**
 * TODO: DX
 * - [] 8개를 넘거나 부족한 경우에 대한 처리
 */

const ringPercent = 87.4;
export function RadialMenu(props: RadialMenuProps) {
  const selectionBgAngle = useMotionValue(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const restSelectionBgAngle = useMotionValue('100%');
  const [activationMode, setActivationMode] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const springSelectionBgAngle = useSpring(selectionBgAngle, {
    stiffness: 500,
    damping: 30,
    mass: 1,
  });
  const background = useMotionTemplate`conic-gradient(
    from ${springSelectionBgAngle}deg,
    rgb(245 245 245) ${restSelectionBgAngle},
    rgb(255 255 255) 0,
    rgb(255 255 255) 100%
  )`;

  const [position, setPosition] = useState({ x: 500, y: 500 });
  const handleRootMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      if (activationMode) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    },
    [activationMode]
  );

  const { children } = props;

  const calcAngle = (x: number, y: number) => {
    const dx = x - position.x;
    const dy = y - position.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }

    return Math.floor(angle);
  };

  const getActiveSection = (angle: number) => {
    /**
     * NOTE: RadialMenuItem 아이템 시작점과 맞추기 위해 180도 플러스
     */
    let startPositionAdjustedAngle = angle + 180; // 시작점 보정
    if (startPositionAdjustedAngle > 360) {
      startPositionAdjustedAngle -= 360;
    }
    const adjustedAngle = startPositionAdjustedAngle % 360; // Shift by 22.5 degrees to center sections
    return Math.floor(adjustedAngle / 45) % 8; // Divide by 45 degrees per section
  };

  useHotKey({
    keycode: [Key.A],
    mode: 'keydown',
    callback: () => {
      setActivationMode(true);
      if (rootRef.current) {
        rootRef.current.style.cursor = CURSOR;
      }
    },
  });

  useHotKey({
    keycode: [Key.A],
    mode: 'keyup',
    callback: () => {
      setActivationMode(false);
      if (rootRef.current) {
        rootRef.current.style.cursor = 'auto';
      }
    },
  });

  return (
    <motion.div
      ref={rootRef}
      onMouseDown={handleRootMouseDown}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
      onMouseMove={e => {
        const angle = calcAngle(e.clientX, e.clientY);
        const sectionIndex = (getActiveSection(angle) + 1) % 8;

        const currentAngle = springSelectionBgAngle.get();
        let nextAngle = (45 * sectionIndex + 270) % 360;

        const delta = nextAngle - currentAngle;
        if (delta > 180) {
          nextAngle -= 360;
        } else if (delta < -180) {
          nextAngle += 360;
        }

        springSelectionBgAngle.set(nextAngle);
        restSelectionBgAngle.set(`${ringPercent}%`);

        setSelectedIndex(sectionIndex);
      }}
    >
      <AnimatePresence>
        <Root
          key={`${position.x}-${position.y}`}
          style={{
            left: position.x - SIZE / 2,
            top: position.y - SIZE / 2,
          }}
          initial={{ scale: 0.8, opacity: 0, rotate: 20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 20 }}
          transition={{
            type: 'spring',
            stiffness: 480,
            damping: 50,
            mass: 1,
          }}
        >
          {/* 선택된 아이템의 활성 흰색 아이템 (가장 바깥에 있는) */}
          <Shadow style={{ background }} />
          <Menu>
            {Children.map(children, (child, index) => {
              return (
                <RadialMenuItemProvider
                  key={index}
                  index={index}
                  // TODO: 이게 꼭.. 상태 + context여야 할까.....?
                  selectedIndex={selectedIndex}
                  active={activationMode}
                >
                  {child}
                </RadialMenuItemProvider>
              );
            })}
            <InnerCircle />
          </Menu>
        </Root>
      </AnimatePresence>
      <LinePath active={activationMode} />
    </motion.div>
  );
}

interface MenuItemProps extends ComponentPropsWithoutRef<typeof Item> {
  children: React.ReactNode;
  onSelect?: VoidFunction;
}
const SKEW = 45;
export function RadialMenuItem(props: MenuItemProps) {
  const { index, selectedIndex, active } =
    useRadialMenuItemContext('RadialMenuItem');
  const angle = 45 * (index + 1) - 90;
  const { children, onSelect, style: styleFromProps, ...restProps } = props;

  useEffect(() => {
    if (index === selectedIndex && active === false) {
      onSelect?.();
    }
  }, [active, index, onSelect, selectedIndex]);

  return (
    <Item
      role="menuitem"
      aria-selected={index === selectedIndex}
      style={{
        ...styleFromProps,
        transform: `rotate(${angle}deg) skew(${SKEW}deg)`,
      }}
      {...restProps}
    >
      <div
        style={{
          position: 'absolute',
          top: '72%',
          left: '65%',
          width: 32,
          height: 32,
        }}
      >
        <ItemContent>{children}</ItemContent>
      </div>
    </Item>
  );
}

const Root = styled(motion.div, {
  position: 'absolute',
  width: SIZE,
  height: SIZE,
});

interface LinePathProps {
  active: boolean;
}

function LinePath(props: LinePathProps) {
  const { active } = props;
  const svgRef = useRef<SVGSVGElement>(null);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseDown: MouseEventHandler<SVGSVGElement> = useCallback(
    e => {
      if (active) {
        setStartPos({ x: e.clientX, y: e.clientY });
      }
    },
    [active]
  );

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = useCallback(
    e => {
      if (active) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [active]
  );

  const pathD =
    startPos.x !== 0
      ? `M ${startPos.x},${startPos.y} L ${mousePos.x},${mousePos.y}`
      : '';

  return (
    <svg
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        // pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <path
        d={pathD}
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          stroke: 'rgba(0, 0, 0, 0.05)',
        }}
      />
    </svg>
  );
}

const Menu = styled('div', {
  width: SIZE,
  height: SIZE,
  position: 'relative',
  borderRadius: 999,
  overflow: 'hidden',
  background: 'white',
});

const ItemContent = styled('div', {
  transform: `skew(${SKEW * -1}deg)`,
  filter: 'grayscale(1) saturate(0.9) brightness(0.9)',
  opacity: 0.26,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Item = styled('div', {
  position: 'absolute',
  bottom: '50%',
  right: '50%',
  borderRight: '1px solid rgba(0, 0, 0, 0.09)',
  width: 200,
  height: 200,
  transformOrigin: '100% 100% 0',

  '&[aria-selected="true"]': {
    [`& ${ItemContent}`]: {
      filter: 'grayscale(0)',
      opacity: 0.8,
    },
  },
});
