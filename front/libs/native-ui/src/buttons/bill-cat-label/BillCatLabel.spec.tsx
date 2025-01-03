import React from 'react';
import { render } from '@testing-library/react-native';

import BillCatLabel from './BillCatLabel';

describe('BillCatLabel', () => {
  it('should render successfully', () => {
    const { root } = render(<BillCatLabel />);
    expect(root).toBeTruthy();
  });
});
