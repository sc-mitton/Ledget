import React from 'react';
import { render } from '@testing-library/react-native';

import ContextMenu from './ContextMenu';

describe('ContextMenu', () => {
  it('should render successfully', () => {
    const { root } = render(< ContextMenu />);
    expect(root).toBeTruthy();
  });
});
