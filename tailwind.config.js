/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{mdx,md,json}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        brand: 'var(--brand)',
        muted: 'var(--muted)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
