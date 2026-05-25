import { detectPackageManager } from '../detectors/package-managers/index.ts';
import { logger } from '../core/logger.ts';
import { enforceRootOrSudo } from '../core/permissions.ts';
import * as installers from '../installers/index.ts';

export class PackageManager {
  /**
   * Installs one or more packages using the detected package manager.
   */
  static async install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
    if (packages.length === 0) {
      return true;
    }

    const pmName = await detectPackageManager();
    if (pmName === 'unknown') {
      logger.error('Cannot install packages: Unknown/unsupported package manager detected.');
      return false;
    }

    if (!options.dryRun) {
      await enforceRootOrSudo();
    }

    logger.info(`Installing packages via ${pmName}: ${packages.join(', ')}`);

    switch (pmName) {
      case 'apt':
        return installers.apt.install(packages, options);
      case 'dnf':
      case 'yum':
        return installers.dnf.install(packages, options);
      case 'pacman':
        return installers.pacman.install(packages, options);
      case 'apk':
        return installers.apk.install(packages, options);
      case 'zypper':
        return installers.zypper.install(packages, options);
      default:
        logger.error(`No installer module defined for package manager: ${pmName}`);
        return false;
    }
  }

  /**
   * Refreshes the local package manager registry caches.
   */
  static async updateRepo(options: { dryRun?: boolean } = {}): Promise<boolean> {
    const pmName = await detectPackageManager();
    if (pmName === 'unknown') {
      return false;
    }

    if (!options.dryRun) {
      await enforceRootOrSudo();
    }

    logger.info(`Refreshing repositories for ${pmName}...`);

    switch (pmName) {
      case 'apt':
        return installers.apt.update(options);
      case 'dnf':
      case 'yum':
        return installers.dnf.update(options);
      case 'pacman':
        return installers.pacman.update(options);
      case 'apk':
        return installers.apk.update(options);
      case 'zypper':
        return installers.zypper.update(options);
      default:
        return false;
    }
  }
}

export default PackageManager;
