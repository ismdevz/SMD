import { Command } from 'commander';
import { installGui } from './install-gui.ts';
import { installRemote } from './install-remote.ts';
import { DesktopManager } from '../managers/desktop-manager.ts';
import { RemoteManager } from '../managers/remote-manager.ts';

export function registerInstallCommand(program: Command): void {
  program
    .command('install <target>')
    .description('Install a supported desktop environment or remote desktop tool')
    .option('--dry-run', 'Preview command installation actions without modifying the system')
    .action(async (target, options) => {
      const lowerTarget = target.toLowerCase();
      const isGui = DesktopManager.getSupportedDesktops().includes(lowerTarget);
      const isRemote = RemoteManager.getSupportedTools().includes(lowerTarget);

      if (!isGui && !isRemote) {
        console.error(`SMD Error: "${target}" is not recognized as a supported Desktop Environment or Remote Tool.`);
        console.error(`Supported Desktop Environments : ${DesktopManager.getSupportedDesktops().join(', ')}`);
        console.error(`Supported Remote Desktop Tools  : ${RemoteManager.getSupportedTools().join(', ')}`);
        process.exit(1);
      }

      let success = false;
      if (isGui) {
        success = await installGui(lowerTarget, { dryRun: !!options.dryRun });
      } else {
        success = await installRemote(lowerTarget, { dryRun: !!options.dryRun });
      }

      if (!success) {
        console.error(`SMD Error: Installation of "${target}" failed.`);
        process.exit(1);
      }

      console.log(`SMD: Successfully completed installation of "${target}".`);
    });
}

export default registerInstallCommand;
