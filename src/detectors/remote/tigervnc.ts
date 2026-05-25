import fs from 'fs';
import type { RemoteToolInfo } from '../../types/remote.ts';

export async function detectTigerVnc(): Promise<RemoteToolInfo | null> {
  const paths = [
    '/usr/bin/tigervncserver',
    '/usr/bin/x0vncserver',
    '/usr/bin/vncserver'
  ];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'tigervnc',
      installed: true,
      running: false, // Updated by service scan/ports check
      port: 5901, // Default VNC Display :1
    };
  }
  return null;
}
