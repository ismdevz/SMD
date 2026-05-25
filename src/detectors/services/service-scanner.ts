import { isSystemdActive, getSystemdServiceStatus } from './systemd.ts';
import { isOpenRcActive, getOpenRcServiceStatus } from './openrc.ts';
import { isInitdActive, getInitdServiceStatus } from './initd.ts';
import type { ServiceStatus } from '../../types/service.ts';

/**
 * Detects which init system is running on the current host.
 */
export function detectInitSystem(): string {
  if (isSystemdActive()) {
    return 'systemd';
  }
  if (isOpenRcActive()) {
    return 'openrc';
  }
  if (isInitdActive()) {
    return 'init.d';
  }
  return 'unknown';
}

/**
 * Query status of a single service by name against the active init system.
 */
export async function scanService(serviceName: string): Promise<{ status: ServiceStatus; enabled: boolean }> {
  const init = detectInitSystem();
  switch (init) {
    case 'systemd':
      return getSystemdServiceStatus(serviceName);
    case 'openrc':
      return getOpenRcServiceStatus(serviceName);
    case 'init.d':
      return getInitdServiceStatus(serviceName);
    default:
      return { status: 'unknown', enabled: false };
  }
}

// Map of common services to scan.
// Keys represent standard report names, values are alternative binary/daemon names to probe.
const SERVICE_PROBES: Record<string, string[]> = {
  ssh: ['ssh', 'sshd'],
  docker: ['docker', 'dockerd'],
  xrdp: ['xrdp'],
  nomachine: ['nxserver', 'nxserverd'],
  nginx: ['nginx'],
  apache: ['apache2', 'httpd'],
  ufw: ['ufw'],
  firewalld: ['firewalld'],
  mysql: ['mysql', 'mariadb', 'mysqld'],
  postgresql: ['postgresql', 'postgres'],
};

/**
 * Scans for common system services and returns their active statuses.
 */
export async function scanCommonServices(): Promise<Record<string, ServiceStatus>> {
  const results: Record<string, ServiceStatus> = {};
  const init = detectInitSystem();
  if (init === 'unknown') {
    return {};
  }

  for (const [friendlyName, probeNames] of Object.entries(SERVICE_PROBES)) {
    for (const probe of probeNames) {
      const res = await scanService(probe);
      if (res.status !== 'unknown') {
        results[friendlyName] = res.status;
        break; // Found a matching service probe, move to next service group
      }
    }
  }

  return results;
}
