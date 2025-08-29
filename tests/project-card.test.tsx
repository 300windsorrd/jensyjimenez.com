import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProjectCard, Project } from '../components/ProjectCard';

const project: Project = {
  title: 'Test Project',
  role: 'Lead',
  date: '2024',
  links: ['#'],
  summary: 'Summary',
};

test('shows project title', () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
