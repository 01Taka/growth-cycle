import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Button } from '../stories/Button';

export function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Button label="Click here" />
    </>
  );
}
