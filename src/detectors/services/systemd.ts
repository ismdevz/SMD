import fs from 'fs';
import { execCommand } from '../../core/shell.ts';
import type { ServiceStatus } from '../../types/service.ts';

/**
 * Check if systemd is the active init system.
 */
export function isSystemdActive(): boolean {
  return fs.existsSync('/run/systemd/system');
}

/**
 * Retrieves the status and enabled state of a systemd service.
 */
export async function getSystemdServiceStatus(serviceName: string): Promise<{ status: ServiceStatus; enabled: boolean }> {
  // Execute systemctl is-active
  const activeRes = await execCommand('systemctl', ['is-active', serviceName]);
  const activeOutput = activeRes.stdout.trim();

  let status: ServiceStatus = 'stopped';
  if (activeOutput === 'active') {
    status = 'running';
  } else if (activeOutput === 'failed') {
    status = 'failed';
  } else if (activeOutput === 'inactive' || activeOutput === 'unknown') {
    status = 'stopped';
  } else {
    status = 'unknown';
  }

  // Execute systemctl is-enabled
  const enabledRes = await execCommand('systemctl', ['is-enabled', serviceName]);
  const enabledOutput = enabledRes.stdout.trim();
  const enabled = enabledOutput === 'enabled' || enabledOutput === 'enabled-runtime';

  return { status, enabled };
}
