import fs from 'fs';
import type { RemoteToolInfo } from '../../types/remote.ts';

export async function detectRemmina(): Promise<RemoteToolInfo | null> {
  const binaryPath = '/usr/bin/remmina';
  const installed = fs.existsSync(binaryPath);

  if (installed) {
    return {
      name: 'remmina',
      installed: true,
      running: false, // Client software, usually not running as a system background daemon
    };
  }
  return null;
}
