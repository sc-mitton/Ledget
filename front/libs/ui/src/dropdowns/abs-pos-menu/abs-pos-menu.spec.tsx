import { render } from '@testing-library/react';

import AbsPosMenu from './abs-pos-menu';

describe('AbsPosMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AbsPosMenu />);
    expect(baseElement).toBeTruthy();
  });
});
