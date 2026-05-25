import fs from 'fs';
import { execCommand } from '../../core/shell.ts';
import type { ServiceStatus } from '../../types/service.ts';

/**
 * Check if SysVInit/init.d is the primary active system (as a fallback).
 */
export function isInitdActive(): boolean {
  return fs.existsSync('/etc/init.d') && !fs.existsSync('/run/systemd/system') && !fs.existsSync('/run/openrc');
}

/**
 * Retrieves the status and enabled state of an init.d script service.
 */
export async function getInitdServiceStatus(serviceName: string): Promise<{ status: ServiceStatus; enabled: boolean }> {
  const scriptPath = `/etc/init.d/${serviceName}`;
  if (!fs.existsSync(scriptPath)) {
    return { status: 'unknown', enabled: false };
  }

  const res = await execCommand(scriptPath, ['status']);
  const output = (res.stdout + ' ' + res.stderr).toLowerCase();

  let status: ServiceStatus = 'stopped';
  if (output.includes('running') || output.includes('is started') || (res.success && res.exitCode === 0)) {
    status = 'running';
  }

  // Determine if it is enabled by checking if there's a start symlink (e.g. S01service) in /etc/rc*.d
  let enabled = false;
  try {
    const rcDirs = ['/etc/rc2.d', '/etc/rc3.d', '/etc/rc4.d', '/etc/rc5.d', '/etc/rc.d'];
    for (const dir of rcDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        // Match files like S01ssh, S20docker, etc.
        const matches = files.some(
          file => file.startsWith('S') && (file.endsWith(serviceName) || file.substring(3) === serviceName)
        );
        if (matches) {
          enabled = true;
          break;
        }
      }
    }
  } catch (err) {
    // Ignore reading directory errors
  }

  return { status, enabled };
}
