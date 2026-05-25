import { Command } from 'commander';
import { detectPackageManager } from '../detectors/package-managers/index.ts';
import { DESKTOP_PACKAGES } from '../constants/desktop-packages.ts';
import { REMOTE_PACKAGES } from '../constants/remote-packages.ts';
import { execCommand } from '../core/shell.ts';
import { enforceRootOrSudo } from '../core/permissions.ts';

export function registerUninstallCommand(program: Command): void {
  program
    .command('uninstall <target>')
    .description('Uninstall a desktop environment or remote desktop tool')
    .option('--dry-run', 'Preview package removal commands without executing them')
    .action(async (target, options) => {
      const lowerTarget = target.toLowerCase();
      const desktop = DESKTOP_PACKAGES.find(d => d.id === lowerTarget);
      const remote = REMOTE_PACKAGES.find(r => r.id === lowerTarget);

      if (!desktop && !remote) {
        console.error(`SMD Error: "${target}" is not recognized as a supported Desktop Environment or Remote Tool.`);
        process.exit(1);
      }

      const pm = await detectPackageManager();
      if (pm === 'unknown') {
        console.error('SMD Error: Unknown/unsupported package manager.');
        process.exit(1);
      }

      const packages = desktop
        ? (desktop.packages as Record<string, string[]>)[pm] || []
        : (remote!.packages as Record<string, string[]>)[pm] || [];

      if (packages.length === 0) {
        console.log(`SMD: No packages mapped for removal of "${target}" using ${pm}.`);
        return;
      }

      if (!options.dryRun) {
        await enforceRootOrSudo();
      }

      let cmd = '';
      let args: string[] = [];

      switch (pm) {
        case 'apt':
          cmd = 'apt-get';
          args = ['remove', '--purge', '-y', ...packages];
          break;
        case 'dnf':
          cmd = 'dnf';
          args = ['remove', '-y', ...packages];
          break;
        case 'yum':
          cmd = 'yum';
          args = ['remove', '-y', ...packages];
          break;
        case 'pacman':
          cmd = 'pacman';
          args = ['-Rns', '--noconfirm', ...packages];
          break;
        case 'apk':
          cmd = 'apk';
          args = ['del', ...packages];
          break;
        case 'zypper':
          cmd = 'zypper';
          args = ['remove', '-y', ...packages];
          break;
      }

      console.log(`SMD: Removing packages: ${packages.join(', ')}...`);
      const res = await execCommand(cmd, args, { sudo: true, dryRun: !!options.dryRun });
      if (res.success) {
        console.log(`SMD: Successfully uninstalled "${target}".`);
      } else {
        console.error(`SMD Error: Failed to uninstall "${target}".`);
        process.exit(1);
      }
    });
}

export default registerUninstallCommand;
