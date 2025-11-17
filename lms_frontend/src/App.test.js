import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app container', () => {
  render(<App />);
  // Basic smoke test for the welcome text we added on home route
  const text = screen.getByText(/Ocean LMS/i);
  expect(text).toBeInTheDocument();
});
