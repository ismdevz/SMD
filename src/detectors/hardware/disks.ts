import { execCommand } from '../../core/shell.ts';

export interface DiskInfo {
  mount: string;
  size: string;
  used: string;
  avail: string;
  usePercent: string;
}

/**
 * Detects disk partitions space and mount points using 'df -h'.
 */
export async function detectDisks(): Promise<DiskInfo[]> {
  const disks: DiskInfo[] = [];

  const res = await execCommand('df', ['-h']);
  if (!res.success) {
    return [];
  }

  const lines = res.stdout.split('\n');
  // Skip header line
  for (const line of lines.slice(1)) {
    const tokens = line.trim().split(/\s+/);
    if (tokens.length < 6) {
      continue;
    }

    const filesystem = tokens[0];
    const size = tokens[1];
    const used = tokens[2];
    const avail = tokens[3];
    const usePercent = tokens[4];
    const mount = tokens[5];

    // Filter to only report physical/root file systems to prevent spamming virtual loop dev info
    if (
      filesystem.startsWith('/dev/') || 
      mount === '/' || 
      filesystem === 'overlay' || 
      filesystem.includes('zfs')
    ) {
      disks.push({
        mount,
        size,
        used,
        avail,
        usePercent,
      });
    }
  }

  return disks;
}
