import { render } from '@testing-library/react';

import Menu from './StyledMenu';

describe('Menu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Menu />);
    expect(baseElement).toBeTruthy();
  });
});
