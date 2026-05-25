import fs from 'fs';
import { readFile } from '../../utils/file.ts';

export async function detectLxc(): Promise<boolean> {
  // Check /proc/1/environ for container=lxc setting
  try {
    if (fs.existsSync('/proc/1/environ')) {
      const env = fs.readFileSync('/proc/1/environ', 'utf8');
      if (env.includes('container=lxc') || env.includes('container=lxd')) {
        return true;
      }
    }
  } catch (err) {
    // Ignore permissions errors
  }

  // Check /proc/1/cgroup contents
  const cgroup = readFile('/proc/1/cgroup');
  if (cgroup.includes('lxc') || cgroup.includes('lxd') || cgroup.includes('/lxc/')) {
    return true;
  }

  return false;
}
