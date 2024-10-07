import React from 'react';
import { render } from '@testing-library/react-native';

import TabsTrack from './TabsTrack';

describe('TabsTrack', () => {
  it('should render successfully', () => {
    const { root } = render(< TabsTrack />);
    expect(root).toBeTruthy();
  });
});
