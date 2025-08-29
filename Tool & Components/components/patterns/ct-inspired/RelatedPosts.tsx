import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export function RelatedPosts({ currentSlug, tags }: { currentSlug: string; tags?: string[] }) {
  const all = getAllPostsMeta();
  const related = all
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => (tags && tags.length ? (p.excerpt || p.title).toLowerCase() : true))
    .slice(0, 3);
  if (related.length === 0) return null;
  return (
    <aside className="mt-12">
      <h3 className="text-lg font-semibold">Related Posts</h3>
      <ul className="mt-3 grid gap-2">
        {related.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}


