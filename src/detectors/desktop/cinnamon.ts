import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectCinnamon(): Promise<DesktopInfo | null> {
  const installed = fs.existsSync('/usr/bin/cinnamon') ||
                    fs.existsSync('/usr/bin/cinnamon-session') ||
                    fs.existsSync('/usr/share/xsessions/cinnamon.desktop');

  if (installed) {
    return {
      name: 'cinnamon',
      installed: true,
    };
  }
  return null;
}
