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

  return installed;
}

export default detectDesktops;
