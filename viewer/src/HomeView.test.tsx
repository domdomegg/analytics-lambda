import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeView from './HomeView';

test('renders choose a project text', () => {
  render(<HomeView />);
  const linkElement = screen.getByText(/choose a project/i);
  expect(linkElement).toBeInTheDocument();
});
