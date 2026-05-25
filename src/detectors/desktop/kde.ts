import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectKde(): Promise<DesktopInfo | null> {
  const paths = [
    '/usr/bin/plasmashell',
    '/usr/bin/startplasma-x11',
    '/usr/bin/startplasma-wayland'
  ];
  const installed = paths.some(p => fs.existsSync(p));

  if (installed) {
    return {
      name: 'kde',
      installed: true,
    };
  }
  return null;
}
