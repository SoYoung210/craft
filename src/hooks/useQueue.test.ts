import { renderHook, act } from '@testing-library/react';

import { useQueue } from './useQueue';

describe('hooks/use-queue', () => {
  it('initialValues길이가 limit값 이하일 때 initialValue가 state에 모두 존재 / queue에는 존재하지 않음', () => {
    const hook = renderHook(() => useQueue({ initialValues: [1], limit: 2 }));
    expect(hook.result.current.state).toEqual([1]);
    expect(hook.result.current.queue).toEqual([]);
  });

  it('initialValues길이가 limit값 이상일 때 initialValue가 state에 limit만큼 존재, 나머지는 queue에 존재', () => {
    const hook = renderHook(() =>
      useQueue({ initialValues: [1, 2, 3, 4, 5], limit: 2 })
    );
    expect(hook.result.current.state).toEqual([1, 2]);
    expect(hook.result.current.queue).toEqual([3, 4, 5]);
  });

  it('아이템을 추가할 때 state길이가 Limit값 이하이면 state에 추가된다.', () => {
    const hook = renderHook(() => useQueue({ initialValues: [1], limit: 2 }));
    act(() => hook.result.current.add(2));
    expect(hook.result.current.state).toEqual([1, 2]);
    expect(hook.result.current.queue).toEqual([]);
  });

  it('아이템을 추가할 때 state길이가 Limit값 이상이면 queue에 추가된다.', () => {
    const hook = renderHook(() =>
      useQueue({ initialValues: [1, 2], limit: 2 })
    );
    act(() => hook.result.current.add(3, 4, 5));
    expect(hook.result.current.state).toEqual([1, 2]);
    expect(hook.result.current.queue).toEqual([3, 4, 5]);
  });

  it('update할때 대상 아이템이 limit값 이상일 경우 state / queue에 적절히 분배', () => {
    const hook = renderHook(() => useQueue({ initialValues: [0], limit: 3 }));
    act(() => hook.result.current.update(() => [1, 2, 3, 4, 5, 6, 7, 8]));
    expect(hook.result.current.state).toEqual([1, 2, 3]);
    expect(hook.result.current.queue).toEqual([4, 5, 6, 7, 8]);
  });
});
