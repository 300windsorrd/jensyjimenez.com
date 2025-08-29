import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/press', label: 'Press' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  return (
    <nav className="sticky top-0 bg-bg/80 backdrop-blur border-b mb-6">
      <ul className="flex flex-wrap gap-4 p-2 text-sm justify-center">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
