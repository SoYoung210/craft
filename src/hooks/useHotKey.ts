import { useEffect, useRef } from 'react';
import { Key } from 'w3c-keys';

import useEventCallback from './useEventCallback';

type KeyboardModifiers = {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};
// FIXME: prevent default shift tab focus backwards
export type ShortcutKey = KeyboardModifiers & {
  key?: string;
};

type AllowedKey = Key | string;

type EventItem = {
  keycode: AllowedKey[];
  callback: (event: KeyboardEvent) => void;
};
function toLowerCase(str: string) {
  return str.toLowerCase();
}
const reservedKeys = [Key.Alt, Key.Control, Key.Meta, Key.Shift];

export default function useHotKey<T extends HTMLElement>({
  keycode,
  callback,
}: EventItem) {
  const triggerRef = useRef<T | null>(null);

  const handleKeyDown = useEventCallback((event: KeyboardEvent) => {
    if (isMatchedKey(parseShortcutKey(keycode), event)) {
      callback(event);
    }
  });

  useEffect(() => {
    const targetRef = triggerRef.current ?? document?.documentElement;
    targetRef.addEventListener('keydown', handleKeyDown);

    return () => targetRef.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return triggerRef;
}

function parseShortcutKey(shortcutKeys: string[]): ShortcutKey {
  const keys = shortcutKeys.map(key => key.toLowerCase());

  const modifiers: KeyboardModifiers = {
    alt: keys.includes(toLowerCase(Key.Alt)),
    ctrl: keys.includes(toLowerCase(Key.Control)),
    meta: keys.includes(toLowerCase(Key.Meta)),
    shift: keys.includes(toLowerCase(Key.Shift)),
  };

  return {
    ...modifiers,
    key: keys.find(key => !reservedKeys.map(toLowerCase).includes(key as Key)),
  };
}

function isMatchedKey(shortcutKey: ShortcutKey, event: KeyboardEvent) {
  const { alt, ctrl, meta, shift, key } = shortcutKey;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event;

  const isEventValueEquals = [
    alt === altKey,
    ctrl === ctrlKey,
    meta === metaKey,
    shift === shiftKey,
  ].every(same => same);

  return (
    (isEventValueEquals &&
      (pressedKey.toLowerCase() === key?.toLowerCase() ||
        event.code.replace('Key', '').toLowerCase() === key?.toLowerCase())) ||
    isEscKeySame(pressedKey, key ?? '')
  );
}

function isEscKeySame(pressedKey: string, key: string) {
  return isEscKey(pressedKey) && isEscKey(key);
}

function isEscKey(key: string) {
  return (
    toLowerCase(key) === toLowerCase(Key.Esc) ||
    toLowerCase(key) === toLowerCase(Key.Escape)
  );
}
