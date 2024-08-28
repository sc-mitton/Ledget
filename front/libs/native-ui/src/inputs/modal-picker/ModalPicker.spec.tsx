import React from 'react';
import { render } from '@testing-library/react-native';

import ModalPicker from './ModalPicker';

describe('ModalPicker', () => {
  it('should render successfully', () => {
    const { root } = render(< ModalPicker />);
    expect(root).toBeTruthy();
  });
});
