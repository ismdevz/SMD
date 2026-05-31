import fs from 'fs';
import type { RemoteToolInfo } from '../../types/remote.ts';

export async function detectNoMachine(): Promise<RemoteToolInfo | null> {
  const paths = ['/usr/bin/nxserver', '/usr/NX/bin/nxserver'];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    // Note: service name is typically 'nxserver'
    return {
      name: 'nomachine',
      installed: true,
      running: fs.existsSync('/var/run/nxserver.pid') || fs.existsSync('/var/run/nxserverd.pid'),
      port: 4000, // Default NoMachine NX port
    };
  }
  return null;
}
