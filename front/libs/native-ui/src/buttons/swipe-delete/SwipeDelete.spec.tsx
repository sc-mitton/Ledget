import React from 'react';
import { render } from '@testing-library/react-native';

import SwipeDelete from './SwipeDelete';

describe('SwipeDelete', () => {
  it('should render successfully', () => {
    const { root } = render(< SwipeDelete />);
    expect(root).toBeTruthy();
  });
});
