import socials from '../../content/social.json';
import { ContactForm } from '../../components/ContactForm';

export const metadata = { title: 'Contact - Jensy Jimenez' };

export default function Page() {
  return (
    <div className="space-y-8">
      <ContactForm />
      <ul className="flex gap-4">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.url} className="text-brand hover:underline">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
