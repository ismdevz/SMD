import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectCinnamon(): Promise<DesktopInfo | null> {
  const paths = ['/usr/bin/cinnamon', '/usr/bin/cinnamon-session'];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'cinnamon',
      installed: true,
    };
  }
  return null;
}
