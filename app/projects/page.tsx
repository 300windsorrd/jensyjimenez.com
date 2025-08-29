import { Suspense } from 'react';
import projects from '../../content/projects.json';
import ProjectsClient from './projects-client';

export const metadata = { title: 'Projects - Jensy Jimenez' };

export default function Page() {
  return (
    <Suspense>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
