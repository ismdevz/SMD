import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectDnf(): Promise<PackageManagerInfo | null> {
  const p = '/usr/bin/dnf';
  if (fs.existsSync(p)) {
    return {
      name: 'dnf',
      path: p,
      isDefault: true,
    };
  }
  return null;
}
