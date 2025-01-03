import React from 'react';
import { render } from '@testing-library/react-native';

import CustomFlatList from './CustomFlatList';

describe('CustomFlatList', () => {
  it('should render successfully', () => {
    const { root } = render(<CustomFlatList />);
    expect(root).toBeTruthy();
  });
});
