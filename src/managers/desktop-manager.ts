import { DESKTOP_PACKAGES } from '../constants/desktop-packages.ts';
import { PackageManager } from './package-manager.ts';
import { detectPackageManager } from '../detectors/package-managers/index.ts';
import { logger } from '../core/logger.ts';

export class DesktopManager {
  /**
   * Retrieves a list of supported desktop environment IDs.
   */
  static getSupportedDesktops(): string[] {
    return DESKTOP_PACKAGES.map(d => d.id);
  }

  /**
   * Installs a desktop environment by matching packages to the active package manager.
   */
  static async install(desktopId: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    const desktop = DESKTOP_PACKAGES.find(d => d.id === desktopId.toLowerCase());
    if (!desktop) {
      logger.error(
        `Desktop environment "${desktopId}" is not supported. Supported: ${this.getSupportedDesktops().join(', ')}`
      );
      return false;
    }

    const pm = await detectPackageManager();
    if (pm === 'unknown') {
      logger.error('Cannot install desktop: Unknown/unsupported package manager.');
      return false;
    }

    const packages = (desktop.packages as Record<string, string[]>)[pm] || [];
    if (packages.length === 0) {
      logger.warn(`No packages mapped for desktop "${desktop.name}" under package manager "${pm}".`);
      return true;
    }

    logger.info(`Beginning installation process for desktop: ${desktop.name}`);
    const success = await PackageManager.install(packages, options);
    if (success) {
      logger.info(`Desktop environment "${desktop.name}" installed successfully!`);
    } else {
      logger.error(`Failed to install desktop environment "${desktop.name}".`);
    }
    return success;
  }
}

export default DesktopManager;
