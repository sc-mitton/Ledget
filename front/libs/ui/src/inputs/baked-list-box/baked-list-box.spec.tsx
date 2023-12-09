import { render } from '@testing-library/react';

import BakedListBox from './baked-list-box';

describe('BakedListBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BakedListBox />);
    expect(baseElement).toBeTruthy();
  });
});
