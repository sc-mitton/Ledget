import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useLoaded from './loaded';

describe('useLoaded', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useLoaded());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
