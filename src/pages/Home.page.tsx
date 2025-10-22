import { Counter } from '@/features/counter/components/Counter';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Counter />
    </>
  );
}
