import { detectApt } from './apt.ts';
import { detectDnf } from './dnf.ts';
import { detectYum } from './yum.ts';
import { detectPacman } from './pacman.ts';
import { detectApk } from './apk.ts';
import { detectZypper } from './zypper.ts';
import type { PackageManagerType } from '../../types/package-manager.ts';

/**
 * Detects the active package manager on the current Linux system.
 */
export async function detectPackageManager(): Promise<PackageManagerType> {
  const detectors = [
    detectApt,
    detectDnf,
    detectYum,
    detectPacman,
    detectApk,
    detectZypper,
  ];

  for (const detector of detectors) {
    const result = await detector();
    if (result) {
      return result.name;
    }
  }

  return 'unknown';
}

export default detectPackageManager;
