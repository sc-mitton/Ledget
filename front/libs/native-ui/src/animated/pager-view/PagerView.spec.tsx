import React from 'react';
import { render } from '@testing-library/react-native';

import PagerView from './PagerView';

describe('PagerView', () => {
  it('should render successfully', () => {
    const { root } = render(<PagerView />);
    expect(root).toBeTruthy();
  });
});
