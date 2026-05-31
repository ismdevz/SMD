import fs from 'fs';
import type { DesktopInfo } from '../../types/desktop.ts';

export async function detectGnome(): Promise<DesktopInfo | null> {
  // Only check for gnome-shell (core GNOME Shell binary).
  // DO NOT check for gnome-session — Cinnamon installs it as a dependency.
  const installed = fs.existsSync('/usr/bin/gnome-shell') ||
                    fs.existsSync('/usr/share/xsessions/gnome.desktop');

  if (installed) {
    return {
      name: 'gnome',
      installed: true,
    };
  }
  return null;
}
