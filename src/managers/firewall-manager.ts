import { execCommand } from '../core/shell.ts';
import { logger } from '../core/logger.ts';
import { enforceRootOrSudo } from '../core/permissions.ts';
import fs from 'fs';

export class FirewallManager {
  /**
   * Identifies which firewall management daemon is active on the host.
   */
  static detectFirewall(): 'ufw' | 'firewalld' | 'none' {
    if (fs.existsSync('/usr/sbin/ufw') || fs.existsSync('/usr/bin/ufw')) {
      return 'ufw';
    }
    if (fs.existsSync('/usr/bin/firewall-cmd') || fs.existsSync('/usr/sbin/firewalld')) {
      return 'firewalld';
    }
    return 'none';
  }

  /**
   * Opens a specific TCP/UDP port on the active firewall daemon.
   */
  static async allowPort(port: number, proto: 'tcp' | 'udp' = 'tcp', options: { dryRun?: boolean } = {}): Promise<boolean> {
    const firewall = this.detectFirewall();
    if (firewall === 'none') {
      logger.info(`No active firewall manager (ufw/firewalld) detected. Skipping port ${port}/${proto} authorization.`);
      return true;
    }

    if (!options.dryRun) {
      await enforceRootOrSudo();
    }

    let cmd = '';
    let args: string[] = [];

    if (firewall === 'ufw') {
      cmd = 'ufw';
      args = ['allow', `${port}/${proto}`];
    } else if (firewall === 'firewalld') {
      // Open port permanently and reload
      cmd = 'firewall-cmd';
      args = ['--permanent', `--add-port=${port}/${proto}`];
    }

    logger.info(`Opening port ${port}/${proto} via ${firewall}...`);
    const res = await execCommand(cmd, args, { sudo: true, dryRun: options.dryRun });

    if (firewall === 'firewalld' && res.success && !options.dryRun) {
      const reloadRes = await execCommand('firewall-cmd', ['--reload'], { sudo: true });
      return reloadRes.success;
    }

    return res.success;
  }
}

export default FirewallManager;
