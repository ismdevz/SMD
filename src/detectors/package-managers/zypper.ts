import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectZypper(): Promise<PackageManagerInfo | null> {
  const p = '/usr/bin/zypper';
  if (fs.existsSync(p)) {
    return {
      name: 'zypper',
      path: p,
      isDefault: true,
    };
  }
  return null;
}
