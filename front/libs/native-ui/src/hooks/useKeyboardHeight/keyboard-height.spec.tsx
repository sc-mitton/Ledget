import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useKeyboardHeight from './keyboard-height';

describe('useKeyboardHeight', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useKeyboardHeight());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
