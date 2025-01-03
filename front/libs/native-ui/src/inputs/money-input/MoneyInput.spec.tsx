import React from 'react';
import { render } from '@testing-library/react-native';

import MoneyInput from './MoneyInput';

describe('MoneyInput', () => {
  it('should render successfully', () => {
    const { root } = render(<MoneyInput />);
    expect(root).toBeTruthy();
  });
});
