import React from 'react';
import { render } from '@testing-library/react-native';

import VictoryTooltip from './VictoryTooltip';

describe('VictoryTooltip', () => {
  it('should render successfully', () => {
    const { root } = render(<VictoryTooltip />);
    expect(root).toBeTruthy();
  });
});
