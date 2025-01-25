import React from 'react';
import { render } from '@testing-library/react-native';

import TrendNumber from './TrendNumber';

describe('TrendNumber', () => {
  it('should render successfully', () => {
    const { root } = render(< TrendNumber />);
    expect(root).toBeTruthy();
  });
});
