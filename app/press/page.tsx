import press from '../../content/press.json';
import { PressItem, PressItemProps } from '../../components/PressItem';

export const metadata = { title: 'Press - Jensy Jimenez' };

export default function Page() {
  return (
    <div>
      {press.map((p: PressItemProps) => (
        <PressItem key={p.title} {...p} />
      ))}
    </div>
  );
}
