import Image from 'next/image';
import Link from 'next/link';

export interface Project {
  title: string;
  role: string;
  date: string;
  links: string[];
  summary: string;
  tags?: string[];
  image?: string;
}

export function ProjectCard({ project, variant = 1 }: { project: Project; variant?: 1 | 2 }) {
  const url = project.links[0] || '#';
  if (variant === 2) {
    return (
      <div className="flex gap-4 border rounded p-4">
        {project.image && (
          <Image src={project.image} alt="" width={64} height={64} className="rounded" />
        )}
        <div>
          <h3 className="font-semibold">
            <Link href={url} className="text-brand hover:underline">
              {project.title}
            </Link>
          </h3>
          <p className="text-sm text-muted">{project.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded overflow-hidden">
      {project.image && (
        <Image src={project.image} alt="" width={600} height={300} className="w-full" />
      )}
      <div className="p-4">
        <h3 className="font-semibold">
          <Link href={url} className="text-brand hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-muted">{project.summary}</p>
      </div>
    </div>
  );
}
