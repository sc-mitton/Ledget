import { render } from '@testing-library/react';

import Misc from './misc';

describe('Misc', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Misc />);
    expect(baseElement).toBeTruthy();
  });
});
