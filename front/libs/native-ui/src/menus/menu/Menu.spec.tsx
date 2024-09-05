import React from 'react';
import { render } from '@testing-library/react-native';

import Menu from './';

describe('Menu', () => {
  it('should render successfully', () => {
    const { root } = render(< Menu />);
    expect(root).toBeTruthy();
  });
});
