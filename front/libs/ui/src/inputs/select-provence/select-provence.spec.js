import { render } from '@testing-library/react';
import SelectProvence from './select-provence';
describe('SelectProvence', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectProvence />);
    expect(baseElement).toBeTruthy();
  });
});
