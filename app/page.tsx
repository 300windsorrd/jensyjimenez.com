import { Suspense } from 'react';
import { Hero } from '../components/Hero';

export default function Home() {
  return (
    <Suspense>
      <Hero />
    </Suspense>
  );
}
