import { Children, ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';

import { styled } from '../../../../stitches.config';

import {
  RadialMenuItemProvider,
  RadialMenuProvider,
  useRadialMenuContext,
  useRadialMenuItemContext,
} from './context';

interface RadialMenuProps {
  children: ReactNode;
}

const ringPercent = 87.4;
export function RadialMenu(props: RadialMenuProps) {
  const selectionBgAngle = useMotionValue(-1);
  const restSelectionBgAngle = useMotionValue('100%');
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
  const { children } = props;

  return (
    <Root>
      <Shadow style={{ background }} />
      {/* TODO: 빼내기? 혹은 아이템만 */}
      <Menu>
        <RadialMenuProvider
          selectionAngleMotionValue={springSelectionBgAngle}
          restSelectionBgAngle={restSelectionBgAngle}
        >
          {Children.map(children, (child, index) => {
            return (
              <RadialMenuItemProvider key={index} index={index}>
                {child}
              </RadialMenuItemProvider>
            );
          })}
        </RadialMenuProvider>
      </Menu>
    </Root>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
}
export function RadialMenuItem(props: MenuItemProps) {
  const { selectionAngleMotionValue, restSelectionBgAngle } =
    useRadialMenuContext('RadialMenuItem');
  const { index } = useRadialMenuItemContext('RadialMenuItem');
  const angle = 45 * (index + 1) - 90;
  const selectionAngle = (45 * index + 270) % 360;
  const { children } = props;
  console.log(children, index, index);

  return (
    <Item
      role="menuitem"
      style={{
        transform: `rotate(${angle}deg) skew(45deg)`,
      }}
      onMouseEnter={e => {
        restSelectionBgAngle.set(`${ringPercent}%`);
        selectionAngleMotionValue.set(selectionAngle);
      }}
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
        {children}
      </div>
    </Item>
  );
}

const Root = styled('div', {
  position: 'relative',
  width: 280,
  height: 280,
});

function Shadow(props: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 280,
        height: 280,
      }}
    >
      <motion.div
        {...props}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: 999,
          boxShadow: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`,
          ...props.style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 288,
            height: 288,
            borderRadius: 999,
            background: 'rgb(250,250,250)',
          }}
        />
      </motion.div>
    </div>
  );
}

const Menu = styled('div', {
  width: 280,
  height: 280,
  position: 'relative',
  borderRadius: 999,
  overflow: 'hidden',
  background: 'white',
});

const Item = styled('div', {
  position: 'absolute',
  bottom: '50%',
  right: '50%',
  borderRight: '1px solid rgba(0, 0, 0, 0.09)',
  width: 200,
  height: 200,
  transformOrigin: '100% 100% 0',
});
