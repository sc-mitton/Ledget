import { render } from '@testing-library/react';

import WithSmallModal from './with-small-modal';

describe('WithSmallModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WithSmallModal />);
    expect(baseElement).toBeTruthy();
  });
});
