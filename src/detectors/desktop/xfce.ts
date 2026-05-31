import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectXfce(): Promise<DesktopInfo | null> {
  const installed = fs.existsSync('/usr/bin/xfce4-session') ||
                    fs.existsSync('/usr/bin/startxfce4') ||
                    fs.existsSync('/usr/share/xsessions/xfce.desktop');

  if (installed) {
    return {
      name: 'xfce',
      installed: true,
    };
  }
  return null;
}
