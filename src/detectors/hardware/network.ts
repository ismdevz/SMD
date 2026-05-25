import os from 'os';

/**
 * Detects network interfaces and their primary IPv4 addresses.
 */
export async function detectNetwork(): Promise<Record<string, string>> {
  const interfaces = os.networkInterfaces();
  const result: Record<string, string> = {};

  for (const [name, infos] of Object.entries(interfaces)) {
    if (!infos) {
      continue;
    }
    for (const info of infos) {
      // Prioritize non-internal IPv4 addresses
      if (info.family === 'IPv4' && !info.internal) {
        result[name] = info.address;
        break; // Store the primary IPv4 for this interface
      }
    }
  }

  // Fallback to internal loopback interfaces if no active external connections are present
  if (Object.keys(result).length === 0) {
    for (const [name, infos] of Object.entries(interfaces)) {
      if (!infos) {
        continue;
      }
      for (const info of infos) {
        if (info.family === 'IPv4') {
          result[name] = info.address;
          break;
        }
      }
    }
  }

  return result;
}
