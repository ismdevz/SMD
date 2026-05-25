import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectGentoo(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'gentoo') {
    return {
      id: 'gentoo',
      name: os.name || 'Gentoo Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}
