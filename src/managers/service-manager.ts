import { detectInitSystem } from '../detectors/services/service-scanner.ts';
import { execCommand } from '../core/shell.ts';
import { logger } from '../core/logger.ts';
import { enforceRootOrSudo } from '../core/permissions.ts';

export class ServiceManager {
  /**
   * Starts a service by name.
   */
  static async start(name: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    return this.runServiceCommand(name, 'start', options);
  }

  /**
   * Stops a service by name.
   */
  static async stop(name: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    return this.runServiceCommand(name, 'stop', options);
  }

  /**
   * Enables a service (configures to autostart on boot).
   */
  static async enable(name: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    return this.runServiceCommand(name, 'enable', options);
  }

  /**
   * Disables a service (stops starting on boot).
   */
  static async disable(name: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
    return this.runServiceCommand(name, 'disable', options);
  }

  /**
   * Main router for executing init system commands.
   */
  private static async runServiceCommand(
    name: string,
    action: 'start' | 'stop' | 'enable' | 'disable',
    options: { dryRun?: boolean } = {}
  ): Promise<boolean> {
    const init = detectInitSystem();
    if (init === 'unknown') {
      logger.error('Cannot manage services: Unknown init system.');
      return false;
    }

    if (!options.dryRun) {
      await enforceRootOrSudo();
    }

    let cmd = '';
    let args: string[] = [];

    if (init === 'systemd') {
      cmd = 'systemctl';
      args = [action, name];
    } else if (init === 'openrc') {
      if (action === 'start' || action === 'stop') {
        cmd = 'rc-service';
        args = [name, action];
      } else if (action === 'enable') {
        cmd = 'rc-update';
        args = ['add', name, 'default'];
      } else {
        cmd = 'rc-update';
        args = ['del', name, 'default'];
      }
    } else if (init === 'init.d') {
      if (action === 'start' || action === 'stop') {
        cmd = `/etc/init.d/${name}`;
        args = [action];
      } else {
        // For SysVInit, update-rc.d is standard on Debian/Ubuntu, chkconfig on RHEL/Fedora
        cmd = 'update-rc.d';
        args = action === 'enable' ? [name, 'defaults'] : [name, 'remove'];
      }
    }

    logger.info(`Service Action [${action.toUpperCase()}] on "${name}" using ${init}`);
    const res = await execCommand(cmd, args, { sudo: true, dryRun: options.dryRun });
    return res.success;
  }
}

export default ServiceManager;
