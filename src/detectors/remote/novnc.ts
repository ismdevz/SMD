import fs from 'fs';
import type { RemoteToolInfo } from '../../types/remote.ts';

export async function detectNoVnc(): Promise<RemoteToolInfo | null> {
  const paths = [
    '/usr/share/novnc',
    '/opt/novnc',
    '/usr/bin/novnc_server',
    '/usr/bin/novnc'
  ];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'novnc',
      installed: true,
      running: false, // Will be cross-referenced with process search or active listener ports
      port: 6080, // Default noVNC port
    };
  }
  return null;
}
