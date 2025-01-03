import React from 'react';
import { render } from '@testing-library/react-native';

import CustomSectionList from './CustomSectionList';

describe('CustomFlatList', () => {
  it('should render successfully', () => {
    const { root } = render(<CustomSectionList />);
    expect(root).toBeTruthy();
  });
});
