import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectMate(): Promise<DesktopInfo | null> {
  const binaryPath = '/usr/bin/mate-session';
  const installed = fs.existsSync(binaryPath);

  if (installed) {
    return {
      name: 'mate',
      installed: true,
    };
  }
  return null;
}
