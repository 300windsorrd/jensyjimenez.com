'use client';
import { useSearchParams } from 'next/navigation';
import { ProjectCard, Project } from '../../components/ProjectCard';

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const variant = params.get('variant') === '2' ? 2 : 1;
  return (
    <div className="grid gap-4">
      {projects.map((p) => (
        <ProjectCard key={p.title} project={p} variant={variant} />
      ))}
    </div>
  );
}
