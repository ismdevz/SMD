import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectKde(): Promise<DesktopInfo | null> {
  const installed = fs.existsSync('/usr/bin/plasmashell') ||
                    fs.existsSync('/usr/bin/startplasma-x11') ||
                    fs.existsSync('/usr/bin/startkde') ||
                    fs.existsSync('/usr/share/xsessions/plasma.desktop');

  if (installed) {
    return {
      name: 'kde',
      installed: true,
    };
  }
  return null;
}
