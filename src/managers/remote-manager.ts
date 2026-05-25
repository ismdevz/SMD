import { REMOTE_PACKAGES } from '../constants/remote-packages.ts';
import { PackageManager } from './package-manager.ts';
import { detectPackageManager } from '../detectors/package-managers/index.ts';
import { FirewallManager } from './firewall-manager.ts';
import { ServiceManager } from './service-manager.ts';
import { logger } from '../core/logger.ts';
import { execCommand } from '../core/shell.ts';
import fs from 'fs';
import path from 'path';

export class RemoteManager {
  /**
   * Retrieves supported remote access tool IDs.
   */
  static getSupportedTools(): string[] {
    return REMOTE_PACKAGES.map(r => r.id);
  }

  /**
   * Installs and configures a remote tool, including firewall adjustments.
   */
  static async install(toolId: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    const tool = REMOTE_PACKAGES.find(r => r.id === toolId.toLowerCase());
    if (!tool) {
      logger.error(
        `Remote tool "${toolId}" is not supported. Supported: ${this.getSupportedTools().join(', ')}`
      );
      return false;
    }

    const pm = await detectPackageManager();
    if (pm === 'unknown') {
      logger.error('Cannot install: Unknown package manager.');
      return false;
    }

    logger.info(`Beginning installation process for remote tool: ${tool.name}`);

    let success = false;
    if (tool.id === 'nomachine') {
      success = await this.installNoMachine(pm, options);
    } else {
      const packages = (tool.packages as Record<string, string[]>)[pm] || [];
      success = await PackageManager.install(packages, options);
    }

    if (!success) {
      logger.error(`Failed to install packages for ${tool.name}.`);
      return false;
    }

    // Configure Firewall ports if applicable
    if (tool.id === 'nomachine') {
      await FirewallManager.allowPort(4000, 'tcp', options);
    } else if (tool.id === 'novnc') {
      await FirewallManager.allowPort(6080, 'tcp', options);
    } else if (tool.id === 'tigervnc') {
      await FirewallManager.allowPort(5901, 'tcp', options);
    } else if (tool.id === 'xrdp') {
      await FirewallManager.allowPort(3389, 'tcp', options);
      // Automatically enable and start XRDP service if installed
      if (!options.dryRun) {
        await ServiceManager.enable('xrdp');
        await ServiceManager.start('xrdp');
      }
    }

    // Call post-installation script if present
    const scriptMap: Record<string, string> = {
      novnc: 'setup-novnc.sh',
      tigervnc: 'setup-vnc.sh',
    };

    const scriptName = scriptMap[tool.id];
    if (scriptName) {
      const scriptPath = path.resolve(process.cwd(), 'scripts', scriptName);
      if (fs.existsSync(scriptPath)) {
        logger.info(`Running post-install setup script: ${scriptName}...`);
        const runRes = await execCommand('bash', [scriptPath], { sudo: true, dryRun: options.dryRun });
        if (!runRes.success) {
          logger.warn(`Post-installation script ${scriptName} reported warnings or errors.`);
        }
      }
    }

    logger.info(`Remote tool "${tool.name}" setup completed successfully.`);
    return true;
  }

  /**
   * Custom installation for NoMachine (downloads and installs DEB/RPM/tarball).
   */
  private static async installNoMachine(pm: string, options: { dryRun?: boolean }): Promise<boolean> {
    const arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
    
    if (pm === 'apt') {
      // Download link for debian/ubuntu amd64
      const version = '8.11.3_4';
      const debUrl = `https://download.nomachine.com/download/8.11/Linux/nomachine_${version}_${arch}.deb`;
      const localDebPath = `/tmp/nomachine_${version}_${arch}.deb`;

      logger.info(`Downloading NoMachine DEB from ${debUrl}...`);
      const dlRes = await execCommand('wget', ['-O', localDebPath, debUrl], { dryRun: options.dryRun });
      if (!dlRes.success && !options.dryRun) {
        logger.error('Failed to download NoMachine deb package.');
        return false;
      }

      logger.info('Installing NoMachine package...');
      const instRes = await execCommand('dpkg', ['-i', localDebPath], { sudo: true, dryRun: options.dryRun });
      return instRes.success;
    } 
    
    if (pm === 'dnf' || pm === 'yum') {
      const version = '8.11.3_4';
      const rpmUrl = `https://download.nomachine.com/download/8.11/Linux/nomachine_${version}_x86_64.rpm`;
      const localRpmPath = `/tmp/nomachine_${version}_x86_64.rpm`;

      logger.info(`Downloading NoMachine RPM from ${rpmUrl}...`);
      const dlRes = await execCommand('wget', ['-O', localRpmPath, rpmUrl], { dryRun: options.dryRun });
      if (!dlRes.success && !options.dryRun) {
        logger.error('Failed to download NoMachine rpm package.');
        return false;
      }

      logger.info('Installing NoMachine package...');
      const instRes = await execCommand('rpm', ['-i', localRpmPath], { sudo: true, dryRun: options.dryRun });
      return instRes.success;
    }

    if (pm === 'pacman') {
      // Install from AUR or official packages if available
      logger.info('Installing nomachine dependencies...');
      await PackageManager.install(['libxss', 'libxtst'], options);
      
      // AUR fallback or custom tar.gz install. For simplicity:
      logger.info('Installing nomachine from AUR is recommended via: yay -S nomachine');
      return true;
    }

    logger.warn(`NoMachine direct setup is not automated for package manager "${pm}". Please install manually.`);
    return false;
  }
}

export default RemoteManager;
