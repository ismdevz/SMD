import fs from 'fs';
import type { RemoteToolInfo } from '../../types/remote.ts';

export async function detectXrdp(): Promise<RemoteToolInfo | null> {
  const paths = ['/usr/sbin/xrdp', '/usr/bin/xrdp', '/etc/xrdp'];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'xrdp',
      installed: true,
      running: fs.existsSync('/var/run/xrdp.pid') || fs.existsSync('/var/run/xrdp/xrdp.pid'),
      port: 3389, // Default RDP port
    };
  }
  return null;
}
