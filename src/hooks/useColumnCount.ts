import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 1280px)';

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches ? 3 : 2;
}

function getServerSnapshot() {
  return 3;
}

export function useColumnCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
