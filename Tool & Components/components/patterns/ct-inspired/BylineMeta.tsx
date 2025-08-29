type BylineMetaProps = {
  author?: string;
  date?: string | Date;
  readingTimeMinutes?: number;
};

export function BylineMeta({ author, date, readingTimeMinutes }: BylineMetaProps) {
  const dt = typeof date === "string" ? new Date(date) : date;
  const dateStr = dt ? dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : undefined;
  return (
    <div className="text-sm opacity-75 flex flex-wrap items-center gap-2">
      {author && <span>By {author}</span>}
      {author && dateStr && <span aria-hidden>•</span>}
      {dateStr && <time dateTime={dt?.toISOString()}>{dateStr}</time>}
      {((author || dateStr) && readingTimeMinutes) ? <span aria-hidden>•</span> : null}
      {readingTimeMinutes ? <span>{readingTimeMinutes} min read</span> : null}
    </div>
  );
}


