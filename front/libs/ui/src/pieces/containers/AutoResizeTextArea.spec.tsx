import { render } from '@testing-library/react';

import AutoResizeTextArea from './AutoResizeTextArea';

describe('AutoResizeTextArea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AutoResizeTextArea />);
    expect(baseElement).toBeTruthy();
  });
});
