export type ServiceStatus = 'running' | 'stopped' | 'failed' | 'unknown';

export interface ServiceInfo {
  name: string;
  status: ServiceStatus;
  enabled: boolean;
}
