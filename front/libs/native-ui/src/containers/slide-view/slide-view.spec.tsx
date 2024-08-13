import React from 'react';
import { render } from '@testing-library/react-native';

import SlideView from './slide-view';

describe('SlideView', () => {
  it('should render successfully', () => {
    const { root } = render(< SlideView />);
    expect(root).toBeTruthy();
  });
});
