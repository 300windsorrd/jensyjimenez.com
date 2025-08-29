import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = { title: 'Writing - Jensy Jimenez' };

export default function Page() {
  const posts = fs
    .readdirSync(path.join(process.cwd(), 'content/writing'))
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, ''), title: file.replace(/\.mdx$/, '').replace(/-/g, ' ') }));
  return (
    <ul className="list-disc pl-5 space-y-2">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/writing/${p.slug}`} className="text-brand hover:underline">
            {p.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
