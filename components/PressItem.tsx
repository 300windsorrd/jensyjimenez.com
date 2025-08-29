import Link from 'next/link';

export interface PressItemProps {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
}

export function PressItem({ title, source, date, url, summary }: PressItemProps) {
  return (
    <article className="border-b py-4">
      <h3 className="font-semibold">
        <Link href={url} className="text-brand hover:underline">
          {title}
        </Link>
      </h3>
      <p className="text-sm text-muted">
        {source} · {date}
      </p>
      <p className="text-sm mt-1">{summary}</p>
    </article>
  );
}
