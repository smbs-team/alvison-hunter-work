import { cleanup, render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  let renderResult: RenderResult;
  beforeEach(() => {
    renderResult = render(<App />);
  });
  afterEach(cleanup);
  it('App should contain the footer component', () => {
    expect(renderResult.getAllByText('Careers').length).toBeGreaterThan(0);
  });
});
