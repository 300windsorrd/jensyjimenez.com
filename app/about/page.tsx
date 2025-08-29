import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Prose } from '../../components/Prose';
import { StatBadges } from '../../components/StatBadges';

export const metadata = { title: 'About - Jensy Jimenez' };

export default function Page() {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'content/about.mdx'),
    'utf8'
  );

  return (
    <Prose>
      <MDXRemote source={source} components={{ StatBadges }} />
    </Prose>
  );
}
