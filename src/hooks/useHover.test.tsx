import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useHover } from './useHover';

const Target: React.FunctionComponent<any> = () => {
  const [ref, hovered] = useHover();

  return (
    <div data-testid="target" ref={ref}>
      {hovered ? 'true' : 'false'}
    </div>
  );
};

describe('hooks/useHover', () => {
  test('마우스 호버액션에 따라 상태가 변경된다.', async () => {
    render(<Target />);
    const user = userEvent.setup();
    const target = screen.getByTestId('target');
    expect(target).toHaveTextContent('false');

    await user.hover(target);
    expect(target).toHaveTextContent('true');

    await user.unhover(target);
    expect(target).toHaveTextContent('false');
  });
});
