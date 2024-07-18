import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />);
  
  // Use waitFor to wait until the element is available
  await waitFor(() => {
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});

