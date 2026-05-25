import type { PackageManagerType } from './package-manager.ts';
import type { ServiceStatus } from './service.ts';

export interface SystemDetails {
  distro: string;
  packageManager: PackageManagerType;
  init: string;
  desktop: string[];
  remote: string[];
  services: Record<string, ServiceStatus>;
  virtualization: string;
  hardware: {
    cpu: string;
    cores: number;
    ram: {
      total: string;
      free: string;
    };
    disks: Array<{
      mount: string;
      size: string;
      used: string;
      avail: string;
      usePercent: string;
    }>;
    gpu: string[];
    network: Record<string, string>;
  };
}
