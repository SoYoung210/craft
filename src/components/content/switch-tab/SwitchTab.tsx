import { Root, Portal, Content, DialogProps } from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { motion } from 'motion/react';
import {
  ButtonHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Key } from 'w3c-keys';

import { If } from '../../utility/If';
import useTimeout from '../../../hooks/useTimeout';
import useHotKey from '../../../hooks/useHotKey';
import useWindowEvent from '../../../hooks/useWindowEvent';

import { SwitchTabProvider, useSwitchTabContext } from './context';
import { NOISE } from './constants';
export interface SwitchTabProps extends DialogProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  actionKey?: Key;
}

export function SwitchTab(props: SwitchTabProps) {
  const {
    children,
    value: valueFromProps,
    defaultValue,
    onValueChange,
    actionKey = Key.Space,
    open: openFromProps,
    onOpenChange,
    defaultOpen,
    ...restProps
  } = props;

  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueFromProps,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    defaultProp: defaultValue,
  });

  const [open, setOpenRaw] = useControllableState<boolean | undefined>({
    prop: openFromProps,
    onChange: onOpenChange as ((value: boolean | undefined) => void) | undefined,
    defaultProp: defaultOpen,
  });

  const setOpen = useCallback(() => {
    setOpenRaw(true);
  }, [setOpenRaw]);

  const setClose = useCallback(() => {
    setOpenRaw(false);
  }, [setOpenRaw]);

  const actionKeyDownRef = useRef(false);

  useHotKey({
    keycode: [Key.Tab],
    callback: () => {
      if (actionKeyDownRef.current) {
        setOpen();
      }
    },
  });

  useHotKey({
    keycode: [Key.Esc],
    callback: setClose,
  });

  useWindowEvent('keydown', e => {
    if (e.key === actionKey) {
      e.preventDefault();
      actionKeyDownRef.current = true;
    }
  });

  useWindowEvent('keyup', e => {
    if (e.key === actionKey) {
      actionKeyDownRef.current = false;
      const target = e.target as HTMLElement;
      target.click();
      setClose();
    }
  });

  return (
    <Root open={open} onOpenChange={setOpenRaw} {...restProps}>
      <Portal>
        <Content
          onOpenAutoFocus={e => e.preventDefault()}
          style={styledContentStyles}
        >
          <SwitchTabProvider value={value} onValueChange={setValue}>
            {children}
          </SwitchTabProvider>
        </Content>
      </Portal>
    </Root>
  );
}

export interface ItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  asChild?: boolean;
}
const Item = forwardRef<HTMLButtonElement, ItemProps>((props, ref) => {
  const { children, value, onFocus, asChild = false, ...restProps } = props;
  const { onValueChange, value: valueFromContext } =
    useSwitchTabContext('Item');

  const itemRef = useRef<HTMLButtonElement>(null);
  const composedRefs = useComposedRefs(ref, itemRef);

  const selected = value === valueFromContext;

  const { start: focusItem, clear } = useTimeout(() => {
    const element = itemRef.current;
    element?.focus();
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  });

  useEffect(() => {
    if (selected) {
      focusItem(100);
      return;
    }

    clear();
  }, [clear, focusItem, selected]);

  return (
    <div style={{ position: 'relative', borderRadius: RADIUS }}>
      <Primitive.button
        ref={composedRefs}
        onFocus={composeEventHandlers(onFocus, () => {
          onValueChange(value);
        })}
        asChild={asChild}
        style={styledItemStyles}
        {...restProps}
      >
        {children}
      </Primitive.button>
      <If condition={selected}>
        <Indicator />
      </If>
    </div>
  );
});

const Indicator = () => {
  return (
    <motion.div
      layoutId="switch-tab-indicator"
      transition={{
        type: 'spring',
        stiffness: 480,
        damping: 38,
        mass: 1,
      }}
      style={styledIndicatorStyles}
    >
      <div
        style={{
          backgroundImage: NOISE,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
        }}
      />
    </motion.div>
  );
};

SwitchTab.Item = Item;

const OUT_OFFSET = 24;
const RADIUS = 28;

const styledIndicatorStyles: React.CSSProperties = {
  position: 'absolute',
  top: OUT_OFFSET * -1,
  left: OUT_OFFSET * -1,
  borderRadius: 16,
  backgroundColor: 'rgba(0, 0, 0, 0.055)',
  width: `calc(100% + ${OUT_OFFSET * 2}px)`,
  height: `calc(100% + ${OUT_OFFSET * 2}px)`,
  zIndex: -1,
};

const styledItemStyles: React.CSSProperties = {
  borderRadius: 'inherit',
  backgroundColor: 'transparent',
  // resetButton styles
  display: 'flex',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  outline: 0,
  border: '0 solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 600,
  WebkitFontSmoothing: 'antialiased',
  // dimensions
  width: 'clamp(288px, 14vw, 360px)',
  aspectRatio: '4 / 3',
};

const styledContentStyles: React.CSSProperties = {
  padding: 48,
  paddingBottom: 52,
  paddingTop: 52,
  backgroundColor: 'hsla(0,0%,100%,0.6)',
  borderRadius: RADIUS,
  backdropFilter: 'blur(12px)',
  boxShadow:
    '0 0 0 1px rgba(0,0,59,0.051),0px 8px 40px rgba(0,0,59,0.051),0px 12px 32px -16px rgba(0,0,0,0.055)',
  outline: 'none',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 878,
  maxWidth: 'calc(100vw - 40px)',
  overflow: 'hidden',
  display: 'grid',
  gridAutoFlow: 'column',
  gap: 64,
};
