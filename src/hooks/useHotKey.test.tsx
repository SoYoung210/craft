import React from 'react';
import { renderHook, render, fireEvent } from '@testing-library/react';
import { Key } from 'w3c-keys';

import useHotKey from './useHotKey';

function dispatchEvent(data: Partial<KeyboardEvent>) {
  const event = new KeyboardEvent('keydown', data);
  document.documentElement.dispatchEvent(event);
}

describe('useHotKey', () => {
  test('keycode가 일치할 때 callback handler가 실행되어야 한다.', () => {
    const callback = jest.fn();
    renderHook(() => useHotKey({ keycode: [Key.Meta, Key.K], callback }));
    dispatchEvent({ key: Key.K, metaKey: true });
    expect(callback).toHaveBeenCalled();
  });

  test('Control Key에 대한 이벤트가 처리되어야 한다.', () => {
    const callback = jest.fn();
    renderHook(() => useHotKey({ keycode: [Key.Control, Key.K], callback }));
    dispatchEvent({ key: Key.K, ctrlKey: true });
    expect(callback).toHaveBeenCalled();
  });

  test('keycode가 일치하지 않을 때 callback handler가 실행되지 않아야 한다.', () => {
    const callback = jest.fn();
    renderHook(() => useHotKey({ keycode: [Key.Alt, Key.L], callback }));
    dispatchEvent({ key: Key.L, metaKey: true });
    expect(callback).not.toHaveBeenCalled();
  });

  test('keycode일치여부는 알파벳 키 대소문자가 달라도 일치하다고 판단된다.', () => {
    const callback = jest.fn();
    renderHook(() => useHotKey({ keycode: [Key.Meta, Key.k], callback }));
    dispatchEvent({ key: Key.K, metaKey: true });
    expect(callback).toHaveBeenCalled();
  });

  test('특정 element의 Keydown 이벤트로도 callback이 실행될 수 있다.', () => {
    const callback = jest.fn();

    const renderHookResult = renderHook(() =>
      useHotKey<HTMLInputElement>({ keycode: [Key.Meta, Key.K], callback })
    );
    const { container } = render(
      <input ref={renderHookResult.result.current} />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.keyDown(input, { key: Key.K, metaKey: true });

    expect(callback).toHaveBeenCalled();
  });

  test('Esc, Escape는 동일한 키코드로 처리된다.', () => {
    const callback = jest.fn();
    renderHook(() => useHotKey({ keycode: [Key.Escape], callback }));
    dispatchEvent({ key: Key.Esc, metaKey: true });
    expect(callback).toHaveBeenCalled();
  });
});
