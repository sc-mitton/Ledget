import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useColorScheme from './use-color-scheme';

describe('useColorScheme', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
