'use client';
import { useState } from 'react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      action="https://formspree.io/f/mnqewkzz"
      method="POST"
      className="space-y-4 max-w-md"
      onSubmit={() => setSent(true)}
    >
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full border px-2 py-1 rounded"
      />
      <textarea
        name="message"
        required
        placeholder="Your message"
        className="w-full border px-2 py-1 rounded"
      />
      <button className="bg-brand text-brand-contrast px-4 py-2 rounded" type="submit">
        {sent ? 'Sent!' : 'Send'}
      </button>
    </form>
  );
}
