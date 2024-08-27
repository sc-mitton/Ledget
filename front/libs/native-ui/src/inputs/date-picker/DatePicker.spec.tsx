import React from 'react';
import { render } from '@testing-library/react-native';

import DatePicker from './DatePicker';

describe('DatePicker', () => {
  it('should render successfully', () => {
    const { root } = render(< DatePicker />);
    expect(root).toBeTruthy();
  });
});
