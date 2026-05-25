import fs from 'fs';
import type { PackageManagerInfo } from '../../types/package-manager.ts';

export async function detectApk(): Promise<PackageManagerInfo | null> {
  const paths = ['/sbin/apk', '/usr/bin/apk'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return {
        name: 'apk',
        path: p,
        isDefault: true,
      };
    }
  }
  return null;
}
