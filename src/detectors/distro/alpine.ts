import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectAlpine(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'alpine') {
    return {
      id: 'alpine',
      name: os.name || 'Alpine Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}
