export type PackageManagerType = 'apt' | 'dnf' | 'yum' | 'pacman' | 'apk' | 'zypper' | 'unknown';

export interface PackageManagerInfo {
  name: PackageManagerType;
  path: string;
  isDefault: boolean;
}
