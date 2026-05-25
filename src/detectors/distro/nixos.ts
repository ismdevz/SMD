import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectNixOS(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'nixos') {
    return {
      id: 'nixos',
      name: os.name || 'NixOS',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}
