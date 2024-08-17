import {
  Children,
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
  useCallback,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { AnimatePresence, motion, useMotionTemplate } from 'framer-motion';
import { Key } from 'w3c-keys';
import { createPortal } from 'react-dom';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { styled } from '../../../../stitches.config';
import useHotKey from '../../../hooks/useHotKey';
import { usePrevious } from '../../../hooks/usePrevious';
import { getDistanceBetween } from '../../../utils/math';

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
import { useSelectionAngle } from './hooks/useSelectionAngle';
import { useActiveMode } from './hooks/useActiveMode';

interface RadialMenuProps {
  children: ReactNode;
}

export function RadialMenu(props: RadialMenuProps) {
  return (
    <Collection.Provider scope={undefined}>
      <Collection.Slot scope={undefined}>
        <RadialMenuImpl {...props} />
      </Collection.Slot>
    </Collection.Provider>
  );
}

const ROTATE_X_VAR = '--rotateX';
const ROTATE_Y_VAR = '--rotateY';
const RadialMenuImpl = forwardRef<HTMLDivElement, RadialMenuProps>(
  (props, ref) => {
    const { updateSelectionAngle, restSelectionBgAngle, springSelectionAngle } =
      useSelectionAngle(-1);

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

    const [moveFlag, setMoveFlag] = useState(false);

    const getItemLabels = useCollection(undefined);

    const { activeMode, activate, deactivate } = useActiveMode(true);
    const [position, setPosition] = useState<Position | null>(null);
    const menuVisible = position != null;
    const prevMenuVisible = usePrevious(menuVisible);

    const rootRef = useRef<HTMLDivElement>(null);
    const combinedRefs = useComposedRefs(ref, rootRef);
    const labelTrackElementRef = useRef<HTMLDivElement>(null);

    const background = useMotionTemplate`conic-gradient(
    from ${springSelectionAngle}deg,
    rgb(245 245 245) ${restSelectionBgAngle},
    rgb(255 255 255) 0,
    rgb(255 255 255) 100%
  )`;

    useEffect(() => {
      const handleResize = () => {
        setPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      };

      if (typeof window !== 'undefined') {
        handleResize();
        window.addEventListener('resize', handleResize);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }, []);

    const handleRootMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
      e => {
        if (activeMode) {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      },
      [activeMode]
    );
    const handleRootMouseUp: MouseEventHandler<HTMLDivElement> =
      useCallback(() => {
        setPosition(null);
        // 초기값이 true이기 때문에 최초의 mouseUp에서 false로 되돌려줌
        deactivate();
        setMoveFlag(false);
      }, [deactivate]);

    const { children } = props;

    const handleMouseMoveRotate = useCallback(
      (e: MouseEvent<HTMLDivElement>, position: Position) => {
        const { x, y } = getRotateValue(
          {
            x: e.clientX,
            y: e.clientY,
          },
          position,
          SIZE
        );
        const distance = getDistanceBetween(position, {
          x: e.clientX,
          y: e.clientY,
        });

        if (distance >= 20) {
          setMoveFlag(true);
        }

        if (rootRef.current != null) {
          rootRef.current.style.setProperty(ROTATE_X_VAR, `${x}deg`);
          rootRef.current.style.setProperty(ROTATE_Y_VAR, `${y}deg`);
        }

        // hide cursor
        if (rootRef.current != null) {
          rootRef.current.style.cursor = 'none';
        }
      },
      []
    );

    const handleMouseMoveSelectionAngle = useCallback(
      (e: MouseEvent<HTMLDivElement>, position: Position) => {
        const sectionIndex = updateSelectionAngle(
          {
            x: e.clientX,
            y: e.clientY,
          },
          position
        );

        setSelectedIndex(sectionIndex);
        const itemLabels = getItemLabels();
        setSelectedLabel(itemLabels[sectionIndex]?.label);
      },
      [getItemLabels, updateSelectionAngle]
    );

    useHotKey({
      keycode: [Key.A],
      mode: 'keydown',
      callback: () => {
        activate();
        if (rootRef.current && !moveFlag && !prevMenuVisible) {
          rootRef.current.style.cursor = CURSOR;
        }
      },
    });

    useHotKey({
      keycode: [Key.A],
      mode: 'keyup',
      callback: () => {
        deactivate();
        setMoveFlag(false);
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
          perspective: 1400,
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
            <Root
              style={{
                left: position.x - SIZE / 2,
                top: position.y - SIZE / 2,
                transform: `rotateX(var(${ROTATE_X_VAR})) rotateY(var(${ROTATE_Y_VAR}))`,
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: 20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 0 }}
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
                <LabelContainer ref={labelTrackElementRef} />
              </motion.div>
            </Root>
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
    labelTrackElement != null && selected && label != null;

  const shouldAnimate =
    (prevSelectedIndex === INITIAL_SELECTED_INDEX &&
      selectedIndex !== INITIAL_SELECTED_INDEX) ||
    (prevSelectedLabel == null && selectedLabel != null);

  useEffect(() => {
    if (selected && active === false) {
      onSelect?.();
    }
  }, [active, onSelect, selected]);

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
              <LabelMotion shouldAnimate={shouldAnimate} selected={selected}>
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
  shouldAnimate,
}: {
  children: ReactNode;
  selected: boolean;
  shouldAnimate: boolean;
}) {
  if (children == null) {
    return <></>;
  }
  return (
    <motion.div
      initial={shouldAnimate ? { scale: 1.1 } : { scale: 1.05 }}
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

const Root = styled('div', {
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
  userSelect: 'none',

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
  color: 'rgb(23, 23, 23)',
  fontVariationSettings: '"wght" 540',
  // fallback
  fontWeight: 530,
  fontSize: 12,
});

function getRotateValue(
  currentPosition: Position,
  prevPosition: Position,
  size: number
) {
  const mouseX = currentPosition.x;
  const mouseY = currentPosition.y;
  const leftX = mouseX - (prevPosition.x - size / 2);
  const topY = mouseY - (prevPosition.y - size / 2);

  const contentX = leftX - size / 2;
  const contentY = topY - size / 2;

  const contentRotateX = contentY / 100;
  const contentRotateY = (-1 * contentX) / 100;

  return {
    x: contentRotateX,
    y: contentRotateY,
  };
}
