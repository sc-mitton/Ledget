import { render } from '@testing-library/react';

import TabNavList from './tab-nav-list';

describe('TabNavList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TabNavList />);
    expect(baseElement).toBeTruthy();
  });
});
