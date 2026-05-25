import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectPacman(): Promise<PackageManagerInfo | null> {
  const p = '/usr/bin/pacman';
  if (fs.existsSync(p)) {
    return {
      name: 'pacman',
      path: p,
      isDefault: true,
    };
  }
  return null;
}
