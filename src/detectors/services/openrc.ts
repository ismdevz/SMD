import fs from 'fs';
import { execCommand } from '../../core/shell.ts';
import type { ServiceStatus } from '../../types/service.ts';

/**
 * Check if OpenRC is the active init system.
 */
export function isOpenRcActive(): boolean {
  return fs.existsSync('/run/openrc') || (fs.existsSync('/sbin/rc-update') && fs.existsSync('/sbin/rc-status'));
}

/**
 * Retrieves the status and enabled state of an OpenRC service.
 */
export async function getOpenRcServiceStatus(serviceName: string): Promise<{ status: ServiceStatus; enabled: boolean }> {
  const statusRes = await execCommand('rc-service', [serviceName, 'status']);
  const output = statusRes.stdout.toLowerCase();

  let status: ServiceStatus = 'stopped';
  if (output.includes('started') || output.includes('running') || (statusRes.success && statusRes.exitCode === 0)) {
    status = 'running';
  } else if (output.includes('crashed') || output.includes('failed')) {
    status = 'failed';
  }

  // Check if it's enabled by checking for service in rc-update output
  const updateRes = await execCommand('rc-update', ['show']);
  const enabled = updateRes.success && updateRes.stdout.includes(serviceName);

  return { status, enabled };
}
