export function StatBadges({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="bg-muted/10 text-sm px-2 py-1 rounded"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
