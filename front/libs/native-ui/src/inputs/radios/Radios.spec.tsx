import React from 'react';
import { render } from '@testing-library/react-native';

import Radios from './Radios';

describe('Radios', () => {
  it('should render successfully', () => {
    const { root } = render(< Radios />);
    expect(root).toBeTruthy();
  });
});
