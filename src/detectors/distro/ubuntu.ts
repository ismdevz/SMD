import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectUbuntu(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'ubuntu') {
    return {
      id: 'ubuntu',
      name: os.name || 'Ubuntu',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'linuxmint') {
    return {
      id: 'linuxmint',
      name: os.name || 'Linux Mint',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'pop') {
    return {
      id: 'popos',
      name: os.name || 'Pop!_OS',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}

