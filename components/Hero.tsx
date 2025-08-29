'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeProvider';
import { useSearchParams } from 'next/navigation';

export interface HeroProps {
  variant?: 1 | 2;
}

export function Hero({ variant: propVariant }: HeroProps = {}) {
  const params = useSearchParams();
  const variant = propVariant ?? (params?.get('variant') === '2' ? 2 : 1);
  const content = (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">Jensy Jimenez</h1>
      <p className="text-lg text-muted max-w-prose">
        Data, design, and automation that move teams forward.
      </p>
      <Link
        href="/contact"
        className="inline-block bg-brand text-brand-contrast px-4 py-2 rounded shadow"
      >
        Get in touch
      </Link>
    </div>
  );

  if (variant === 2) {
    return <div className="relative text-center py-24">{content}</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 items-center py-16">
      {content}
      <Image
        src="/avatar.png"
        alt="Jensy headshot"
        width={320}
        height={320}
        className="rounded-full mx-auto"
      />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
    </div>
  );
}
