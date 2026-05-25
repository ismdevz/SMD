import { detectDebian } from './debian.ts';
import { detectUbuntu } from './ubuntu.ts';
import { detectArch } from './arch.ts';
import { detectFedora } from './fedora.ts';
import { detectAlpine } from './alpine.ts';
import { detectOpenSUSE } from './opensuse.ts';
import { detectGentoo } from './gentoo.ts';
import { detectNixOS } from './nixos.ts';
import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

/**
 * Iterates through distro detectors to determine the current running distribution.
 */
export async function detectDistro(): Promise<DistroInfo> {
  const detectors = [
    detectUbuntu, // Check Ubuntu first as it inherits from Debian
    detectDebian,
    detectArch,
    detectFedora,
    detectAlpine,
    detectOpenSUSE,
    detectGentoo,
    detectNixOS,
  ];

  for (const detector of detectors) {
    const result = await detector();
    if (result) {
      return result;
    }
  }

  // Fallback to generic release parsing if no specific match
  const os = parseOsRelease();
  return {
    id: os.id || 'unknown',
    name: os.name || 'Generic Linux Distro',
    version: os.version || 'unknown',
    codename: os.codename,
  };
}

export default detectDistro;
