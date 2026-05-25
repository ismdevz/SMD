import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectArch(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'arch') {
    return {
      id: 'archlinux',
      name: os.name || 'Arch Linux',
      version: os.version || 'rolling',
      codename: os.codename,
    };
  }
  if (os.id === 'manjaro') {
    return {
      id: 'manjaro',
      name: os.name || 'Manjaro Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}
