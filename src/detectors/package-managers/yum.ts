import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectYum(): Promise<PackageManagerInfo | null> {
  const p = '/usr/bin/yum';
  if (fs.existsSync(p)) {
    return {
      name: 'yum',
      path: p,
      isDefault: true,
    };
  }
  return null;
}
