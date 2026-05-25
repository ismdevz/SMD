import os from 'os';

/**
 * Detects system memory capacity (total and current free RAM) in GB.
 */
export async function detectRam(): Promise<{ total: string; free: string }> {
  const totalBytes = os.totalmem();
  const freeBytes = os.freemem();

  const toGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';

  return {
    total: toGB(totalBytes),
    free: toGB(freeBytes),
  };
}
