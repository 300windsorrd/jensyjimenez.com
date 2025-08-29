import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Prose } from '../../../components/Prose';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  return fs
    .readdirSync(path.join(process.cwd(), 'content/writing'))
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, '') }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = path.join(process.cwd(), 'content/writing', `${slug}.mdx`);
  if (!fs.existsSync(file)) return notFound();
  const source = fs.readFileSync(file, 'utf8');
  return (
    <Prose>
      <MDXRemote source={source} />
    </Prose>
  );
}
