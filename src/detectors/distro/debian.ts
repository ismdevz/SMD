import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectDebian(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'debian') {
    return {
      id: 'debian',
      name: os.name || 'Debian GNU/Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'kali') {
    return {
      id: 'kali',
      name: os.name || 'Kali Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'parrot') {
    return {
      id: 'parrot',
      name: os.name || 'Parrot OS',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}

