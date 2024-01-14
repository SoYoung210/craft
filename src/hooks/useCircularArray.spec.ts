import { act, renderHook } from '@testing-library/react';

import useCircularArray from './useCircularArray';

describe('hooks-common/userCircularuseCircularArrayIndex', () => {
  test('next를 호출하면 첫 번째 아이템이 가장 뒤쪽으로 이동한다.', () => {
    const { result } = renderHook(() => useCircularArray([1, 2, 3]));

    const [, { next }] = result.current;
    act(() => {
      next(1);
    });

    const [resultArray] = result.current;

    expect(resultArray).toStrictEqual([2, 3, 1]);
  });

  test('next를 두번 호출하는 경우 첫 번째, 두 번째 아이템이 뒤로 이동한다.', () => {
    const { result } = renderHook(() => useCircularArray([1, 2, 3]));

    const [, { next }] = result.current;
    act(() => {
      next(1);
      next(1);
    });
    const [resultArray] = result.current;

    expect(resultArray).toStrictEqual([3, 1, 2]);
  });

  test('prev를 호출하면 마지막 아이템이 첫 번째로 이동한다.', () => {
    const { result } = renderHook(() => useCircularArray([1, 2, 3]));

    const [, { prev }] = result.current;
    act(() => {
      prev(1);
    });

    const [resultArray] = result.current;
    expect(resultArray).toStrictEqual([3, 1, 2]);
  });

  test('prev를 두번 호출하는 경우 두 번째, 세 번째 아이템이 앞으로 이동한다.', () => {
    const { result } = renderHook(() => useCircularArray([1, 2, 3]));

    const [, { prev }] = result.current;
    act(() => {
      prev(1);
      prev(1);
    });
    const [resultArray] = result.current;
    expect(resultArray).toStrictEqual([2, 3, 1]);
  });
});
