import { render } from '@testing-library/react';

import TrendNumber from './TrendNumber';

describe('TrendNumber', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TrendNumber />);
    expect(baseElement).toBeTruthy();
  });
});
