import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectMate(): Promise<DesktopInfo | null> {
  const installed = fs.existsSync('/usr/bin/mate-session') ||
                    fs.existsSync('/usr/bin/mate-about') ||
                    fs.existsSync('/usr/share/xsessions/mate.desktop');

  if (installed) {
    return {
      name: 'mate',
      installed: true,
    };
  }
  return null;
}
