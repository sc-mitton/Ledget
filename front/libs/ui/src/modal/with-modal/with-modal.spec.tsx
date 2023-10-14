import { render } from '@testing-library/react';

import WithModal from './with-modal';

describe('WithModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WithModal />);
    expect(baseElement).toBeTruthy();
  });
});
