import type { KeyboardEvent } from 'react';
import { Key } from 'w3c-keys';

function isTargetKey(event: KeyboardEvent, key: string) {
  return event.key === key;
}

export function isEnterKey(event: KeyboardEvent<HTMLElement>) {
  return isTargetKey(event, Key.Enter);
}
