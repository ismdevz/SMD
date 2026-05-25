import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectOpenSUSE(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'opensuse' || os.id?.includes('opensuse') || os.id === 'sles') {
    return {
      id: 'opensuse',
      name: os.name || 'openSUSE',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}
