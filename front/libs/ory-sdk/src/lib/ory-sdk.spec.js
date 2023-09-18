import { render } from '@testing-library/react';
import OrySdk from './ory-sdk';
describe('OrySdk', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrySdk />);
    expect(baseElement).toBeTruthy();
  });
});
