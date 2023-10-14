import { render } from '@testing-library/react';

import Otc from './otc';

describe('Otc', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Otc />);
    expect(baseElement).toBeTruthy();
  });
});
