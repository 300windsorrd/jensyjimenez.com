import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Hero } from '../components/Hero';

test('renders CTA', () => {
  render(<Hero />);
  expect(screen.getByText('Get in touch')).toBeInTheDocument();
});
