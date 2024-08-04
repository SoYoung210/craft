import {
  Children,
  ComponentPropsWithoutRef,
  Fragment,
  MouseEventHandler,
  ReactNode,
  useCallback,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Key } from 'w3c-keys';
import { createPortal } from 'react-dom';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { styled } from '../../../../stitches.config';
import useHotKey from '../../../hooks/useHotKey';
import { getAngleBetweenPositions } from '../../../utils/math';
import { usePrevious } from '../../../hooks/usePrevious';

import { Position } from './types';
import {
  Collection,
  INITIAL_SELECTED_INDEX,
  RadialMenuItemProvider,
  RadialMenuProvider,
  useCollection,
  useRadialMenuContext,
  useRadialMenuItemContext,
} from './context';
import { InnerCircle, LinePath, Shadow } from './StyleUtils';
import { CURSOR, SIZE } from './constants';

interface RadialMenuProps {
  children: ReactNode;
}

/**
 * WorkLog
 * - [] 아이템 활성화 될때 밑에 라벨 정보 보여줘야 함 (Item이 받아서 보여주도록?)
 * - [] NOTE: 어차피 Children API를 쓰고 있는데... 부분에 대한 리팩토링 고민해보기
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
 * - [x] 처음엔 그냥 나오고, A를 누르고 클릭하면 커서를 바꾸고, 그 위치에 나오도록

 */

/**
 * TODO: DX
 * - [] 8개를 넘거나 부족한 경우에 대한 처리
 */

export function RadialMenu(props: RadialMenuProps) {
  return (
    <Collection.Provider scope={undefined}>
      <Collection.Slot scope={undefined}>
        <RadialMenuImpl {...props} />
      </Collection.Slot>
    </Collection.Provider>
  );
}
const ringPercent = 87.4;
const ROTATE_X_VAR = '--rotateX';
const ROTATE_Y_VAR = '--rotateY';
const RadialMenuImpl = forwardRef<HTMLDivElement, RadialMenuProps>(
  (props, ref) => {
    const selectionBgAngle = useMotionValue(-1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const getItemLabels = useCollection(undefined);
    const restSelectionBgAngle = useMotionValue('100%');

    const activeModeRef = useRef(true);
    const [position, setPosition] = useState<Position | null>({
      x: 500,
      y: 500,
    });
    const menuVisible = position != null;

    const rootRef = useRef<HTMLDivElement>(null);
    const combinedRefs = useComposedRefs(ref, rootRef);
    const labelTrackElementRef = useRef<HTMLDivElement>(null);

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

    const handleRootMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
      e => {
        if (activeModeRef.current) {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      },
      []
    );
    const handleRootMouseUp: MouseEventHandler<HTMLDivElement> =
      useCallback(() => {
        setPosition(null);
        // 초기값이 true이기 때문에 최초의 mouseUp에서 false로 되돌려줌
        activeModeRef.current = false;
      }, []);

    const { children } = props;

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

    const handleMouseMoveRotate = useCallback(
      (e: MouseEvent<HTMLDivElement>, position: Position) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - (position.x - SIZE / 2);
        const topY = mouseY - (position.y - SIZE / 2);

        const contentX = leftX - SIZE / 2;
        const contentY = topY - SIZE / 2;

        const contentRotateX = contentY / 100;
        const contentRotateY = (-1 * contentX) / 100;

        if (rootRef.current != null) {
          rootRef.current.style.setProperty(
            ROTATE_X_VAR,
            `${contentRotateX * 1}deg`
          );
          rootRef.current.style.setProperty(
            ROTATE_Y_VAR,
            `${contentRotateY * 1}deg`
          );
        }
      },
      []
    );

    const handleMouseMoveSelectionAngle = useCallback(
      (e: MouseEvent<HTMLDivElement>, position: Position) => {
        const angle = getAngleBetweenPositions(position, {
          x: e.clientX,
          y: e.clientY,
        });
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
        const itemLabels = getItemLabels();
        /**
         * NOTE: 어차피 Children API를 쓰고 있는데... 이런식으로 복잡하게 할 필요가 있나?
         * 뭔가... Children.map도는 부분에서 selectedIndex랑 비교해서 현재 선택된 라벨만 넣어주면... (prop을 참조해서...)
         * 그게 뭔가 깔끔하진 않지만 간단한 구현이긴한듯?
         */
        setSelectedLabel(itemLabels[sectionIndex]?.label);
      },
      [getItemLabels, restSelectionBgAngle, springSelectionBgAngle]
    );

    // TODO: activeMode핸들하는걸 훅으로  빼던가.. 뭔가 중앙 관리가 필요해보임.
    useHotKey({
      keycode: [Key.A],
      mode: 'keydown',
      callback: () => {
        activeModeRef.current = true;
        if (rootRef.current) {
          rootRef.current.style.cursor = CURSOR;
        }
      },
    });

    useHotKey({
      keycode: [Key.A],
      mode: 'keyup',
      callback: () => {
        activeModeRef.current = false;
        if (rootRef.current) {
          rootRef.current.style.cursor = 'auto';
        }
      },
    });

    return (
      <motion.div
        ref={combinedRefs}
        onMouseDown={handleRootMouseDown}
        onMouseUp={handleRootMouseUp}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          perspective: 1800,
        }}
        onMouseMove={e => {
          if (position == null) {
            return;
          }
          handleMouseMoveRotate(e, position);
          handleMouseMoveSelectionAngle(e, position);
        }}
      >
        <AnimatePresence>
          {menuVisible && (
            <Fragment key={`${position.x}-${position.y}`}>
              <Root
                style={{
                  left: position.x - SIZE / 2,
                  top: position.y - SIZE / 2,
                  rotateX: `var(${ROTATE_X_VAR})`,
                  rotateY: `var(${ROTATE_Y_VAR})`,
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
                  <RadialMenuProvider
                    labelTrackElement={labelTrackElementRef.current}
                    // TODO: 이게 꼭.. 상태 + context여야 할까.....?
                    selectedIndex={selectedIndex}
                    selectedLabel={selectedLabel}
                    active={menuVisible}
                  >
                    {Children.map(children, (child, index) => {
                      return (
                        <RadialMenuItemProvider key={index} index={index}>
                          {child}
                        </RadialMenuItemProvider>
                      );
                    })}
                  </RadialMenuProvider>
                  <InnerCircle />
                </Menu>
                <LabelContainer
                  ref={labelTrackElementRef}
                  data-debug-role="label-track-element"
                />
              </Root>
            </Fragment>
          )}
        </AnimatePresence>
        {position != null ? (
          <LinePath
            initialPos={{
              x: position.x,
              y: position.y,
            }}
          />
        ) : null}
      </motion.div>
    );
  }
);

interface MenuItemProps extends ComponentPropsWithoutRef<typeof Item> {
  children: React.ReactNode;
  onSelect?: VoidFunction;
  label?: string;
}
const SKEW = 45;
export function RadialMenuItem(props: MenuItemProps) {
  const { index } = useRadialMenuItemContext('RadialMenuItem');
  const { labelTrackElement, selectedIndex, active, selectedLabel } =
    useRadialMenuContext('RadialMenuItem');
  const angle = 45 * (index + 1) - 90;
  const prevSelectedIndex = usePrevious(selectedIndex);
  const prevSelectedLabel = usePrevious(selectedLabel);

  const {
    children,
    onSelect,
    style: styleFromProps,
    label,
    ...restProps
  } = props;

  const selected = index === selectedIndex;
  const shouldRenderLabel =
    labelTrackElement != null &&
    selectedIndex !== INITIAL_SELECTED_INDEX &&
    label != null;

  const shouldAnimate =
    (prevSelectedIndex === INITIAL_SELECTED_INDEX &&
      selectedIndex !== INITIAL_SELECTED_INDEX) ||
    (prevSelectedLabel == null && selectedLabel != null);

  useEffect(() => {
    if (selected && active === false) {
      onSelect?.();
    }
  }, [active, onSelect, selected]);

  /*
    TODO: TODO:handleMouseMoveSelectionAngle 시점에 Collection.ItemSlot으로
    Item의 라벨을 가져오자. 그걸로 setSelectedLabel을 설정하고, 여기서 애니메이션 컨트롤 하면 될
    아.. 근데 더 나은 리팩토링 방법 없나. 성능상 좀 안좋긴 한데...
  */
  return (
    <Collection.ItemSlot scope={undefined} label={label ?? null}>
      <div>
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
        {shouldRenderLabel
          ? createPortal(
              <LabelMotion
                key={shouldAnimate ? 'animate' : 'default'}
                selected={selected}
              >
                {label}
              </LabelMotion>,
              labelTrackElement
            )
          : null}
      </div>
    </Collection.ItemSlot>
  );
}

function LabelMotion({
  children,
  selected,
}: {
  children: ReactNode;
  selected: boolean;
}) {
  if (children == null) {
    return <></>;
  }
  return (
    <motion.div
      initial={{
        scale: 1.1,
      }}
      animate={{
        scale: 1.05,
      }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 55,
      }}
    >
      {selected ? <LabelContent>{children}</LabelContent> : null}
    </motion.div>
  );
}

const Root = styled(motion.div, {
  position: 'absolute',
  width: SIZE,
  height: SIZE,
});

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

const LabelContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 24,
});

const LabelContent = styled('div', {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '4px 6px',
  borderRadius: 6,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)',
  backdropFilter: 'blur(12px)',
  color: 'rgb(23, 23, 23)',
  fontWeight: 450,
});
