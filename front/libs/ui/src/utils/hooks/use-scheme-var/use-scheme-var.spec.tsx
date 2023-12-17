import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useSchemeVar from './use-scheme-var';

describe('useSchemeVar', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useSchemeVar());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
