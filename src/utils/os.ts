import { readFile } from './file.ts';

export interface OsRelease {
  id?: string;
  name?: string;
  version?: string;
  versionId?: string;
  codename?: string;
}

/**
 * Parses /etc/os-release or /usr/lib/os-release to retrieve Linux distribution properties.
 */
export function parseOsRelease(): OsRelease {
  const content = readFile('/etc/os-release') || readFile('/usr/lib/os-release');
  if (!content) return {};

  const info: Record<string, string> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIdx = trimmed.indexOf('=');
    if (equalsIdx === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIdx).trim().toUpperCase();
    let val = trimmed.slice(equalsIdx + 1).trim();

    // Strip wrapping quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    info[key] = val;
  }

  return {
    id: info.ID,
    name: info.NAME,
    version: info.VERSION_ID || info.VERSION,
    versionId: info.VERSION_ID,
    codename: info.VERSION_CODENAME || parseCodenameFromVersion(info.VERSION),
  };
}

function parseCodenameFromVersion(versionStr?: string): string | undefined {
  if (!versionStr) {
    return undefined;
  }
  const match = versionStr.match(/\(([^)]+)\)/);
  return match ? match[1].toLowerCase() : undefined;
}
