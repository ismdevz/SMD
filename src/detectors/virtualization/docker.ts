import fs from 'fs';
import { readFile } from '../../utils/file.ts';

export async function detectDocker(): Promise<boolean> {
  // Check if .dockerenv exists
  if (fs.existsSync('/.dockerenv')) {
    return true;
  }

  // Check /proc/1/cgroup
  const cgroup = readFile('/proc/1/cgroup');
  if (cgroup.includes('docker') || cgroup.includes('docker-')) {
    return true;
  }

  return false;
}
