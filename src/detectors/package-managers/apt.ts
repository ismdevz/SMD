import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectApt(): Promise<PackageManagerInfo | null> {
  const paths = ['/usr/bin/apt-get', '/usr/bin/apt'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return {
        name: 'apt',
        path: p,
        isDefault: true,
      };
    }
  }
  return null;
}
