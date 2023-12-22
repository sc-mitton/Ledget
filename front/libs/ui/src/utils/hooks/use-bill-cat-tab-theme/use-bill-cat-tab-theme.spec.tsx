import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useBillCatTabTheme from './use-bill-cat-tab-theme';

describe('useBillCatTabTheme', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useBillCatTabTheme());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
