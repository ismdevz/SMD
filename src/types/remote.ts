export type RemoteToolType = 'nomachine' | 'novnc' | 'tigervnc' | 'remmina' | 'xrdp';

export interface RemoteToolInfo {
  name: RemoteToolType;
  installed: boolean;
  running: boolean;
  port?: number;
}
