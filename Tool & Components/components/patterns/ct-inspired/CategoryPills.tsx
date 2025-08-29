export function CategoryPills({ tags }: { tags: string[] | undefined }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] border px-3 py-1 text-xs">
          {t}
        </span>
      ))}
    </div>
  );
}


