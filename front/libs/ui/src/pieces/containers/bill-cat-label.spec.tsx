import { render } from '@testing-library/react';

import BillCatLabel from './bill-cat-label';

describe('BillCatLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BillCatLabel />);
    expect(baseElement).toBeTruthy();
  });
});
