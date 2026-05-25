import { detectNoMachine } from './nomachine.ts';
import { detectNoVnc } from './novnc.ts';
import { detectTigerVnc } from './tigervnc.ts';
import { detectRemmina } from './remmina.ts';
import { detectXrdp } from './xrdp.ts';

/**
 * Detects all installed remote desktop tools.
 */
export async function detectRemoteTools(): Promise<string[]> {
  const detectors = [
    detectNoMachine,
    detectNoVnc,
    detectTigerVnc,
    detectRemmina,
    detectXrdp,
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

export default detectRemoteTools;
