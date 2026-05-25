export type DesktopEnvironmentType = 'xfce' | 'mate' | 'gnome' | 'kde' | 'cinnamon' | 'unknown';

export interface DesktopInfo {
  name: DesktopEnvironmentType;
  installed: boolean;
  version?: string;
}
