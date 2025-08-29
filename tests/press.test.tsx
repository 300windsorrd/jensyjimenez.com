import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { PressItem } from '../components/PressItem';

test('renders press source', () => {
  render(
    <PressItem
      title="Title"
      source="Source"
      date="2024"
      url="#"
      summary="Summary"
    />
  );
  expect(screen.getByText(/Source/)).toBeInTheDocument();
});
