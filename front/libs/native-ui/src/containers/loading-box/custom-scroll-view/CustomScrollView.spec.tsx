import React from 'react';
import { render } from '@testing-library/react-native';

import CustomScrollView from './CustomScrollView';

describe('CustomScrollView', () => {
  it('should render successfully', () => {
    const { root } = render(< CustomScrollView />);
    expect(root).toBeTruthy();
  });
});
