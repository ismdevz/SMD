import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectXfce(): Promise<DesktopInfo | null> {
  const binaryPath = '/usr/bin/xfce4-session';
  const installed = fs.existsSync(binaryPath);

  if (installed) {
    return {
      name: 'xfce',
      installed: true,
    };
  }
  return null;
}
