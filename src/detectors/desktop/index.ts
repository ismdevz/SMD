import { detectXfce } from './xfce.ts';
import { detectMate } from './mate.ts';
import { detectGnome } from './gnome.ts';
import { detectKde } from './kde.ts';
import { detectCinnamon } from './cinnamon.ts';

/**
 * Detects all installed desktop environments on the system.
 */
export async function detectDesktops(): Promise<string[]> {
  const detectors = [
    detectXfce,
    detectMate,
    detectGnome,
    detectKde,
    detectCinnamon,
  ];

  const installed: string[] = [];

  for (const detector of detectors) {
    const result = await detector();
    if (result && result.installed) {
      installed.push(result.name);
    }
  }

  // Cross-reference with XDG environment variables for active session DEs
  const current = process.env.XDG_CURRENT_DESKTOP?.toLowerCase();
  if (current) {
    let matchedName: string | null = null;
    if (current.includes('xfce')) {
      matchedName = 'xfce';
    } else if (current.includes('mate')) {
      matchedName = 'mate';
    } else if (current.includes('gnome')) {
      matchedName = 'gnome';
    } else if (current.includes('kde') || current.includes('plasma')) {
      matchedName = 'kde';
    } else if (current.includes('cinnamon')) {
      matchedName = 'cinnamon';
    }

    if (matchedName && !installed.includes(matchedName)) {
      installed.push(matchedName);
    }
  }

  return installed;
}

export default detectDesktops;
