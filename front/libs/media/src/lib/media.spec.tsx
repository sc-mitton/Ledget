import { render } from '@testing-library/react';

import Media from './media';

describe('Media', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Media />);
    expect(baseElement).toBeTruthy();
  });
});
