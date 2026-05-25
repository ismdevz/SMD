import { parseOsRelease } from '../../utils/os.ts';
import type { DistroInfo } from '../../types/distro.ts';

export async function detectFedora(): Promise<DistroInfo | null> {
  const os = parseOsRelease();
  if (os.id === 'fedora') {
    return {
      id: 'fedora',
      name: os.name || 'Fedora',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'rhel') {
    return {
      id: 'rhel',
      name: os.name || 'Red Hat Enterprise Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'centos') {
    return {
      id: 'centos',
      name: os.name || 'CentOS',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'rocky') {
    return {
      id: 'rocky',
      name: os.name || 'Rocky Linux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  if (os.id === 'almalinux') {
    return {
      id: 'almalinux',
      name: os.name || 'AlmaLinux',
      version: os.version || 'unknown',
      codename: os.codename,
    };
  }
  return null;
}

