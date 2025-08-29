import Link from "next/link";

export type ArticleCardProps = {
  href: string;
  title: string;
  overline?: string;
  excerpt?: string;
  image?: string;
};

export function ArticleCardA({ href, title, overline, excerpt }: ArticleCardProps) {
  return (
    <article className="card p-5 border rounded-md hover:shadow-md transition-shadow">
      {overline && <div className="text-xs uppercase tracking-wide text-[var(--brand-700)]">{overline}</div>}
      <h3 className="mt-1 text-lg font-semibold leading-snug">
        <Link href={href}>{title}</Link>
      </h3>
      {excerpt && <p className="mt-2 text-sm opacity-80 line-clamp-3">{excerpt}</p>}
      <div className="mt-3 text-sm text-[var(--brand-600)]">Read</div>
    </article>
  );
}


