import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectGnome(): Promise<DesktopInfo | null> {
  const paths = ['/usr/bin/gnome-shell', '/usr/bin/gnome-session'];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'gnome',
      installed: true,
    };
  }
  return null;
}
