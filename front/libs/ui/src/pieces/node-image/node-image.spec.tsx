import { render } from '@testing-library/react';

import NodeImage from './node-image';

describe('NodeImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NodeImage />);
    expect(baseElement).toBeTruthy();
  });
});
