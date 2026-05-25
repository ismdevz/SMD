import { Command } from 'commander';
import { PackageManager } from '../managers/package-manager.ts';

export function registerUpdateCommand(program: Command): void {
  program
    .command('update')
    .description('Refresh package manager index cache registers')
    .option('--dry-run', 'Preview the update commands without executing them')
    .action(async (options) => {
      try {
        console.log('SMD: Refreshing system package indexes...');
        const success = await PackageManager.updateRepo({ dryRun: !!options.dryRun });
        if (success) {
          console.log('SMD: Repository indexes updated successfully.');
        } else {
          console.error('SMD Error: Repository database synchronization failed.');
          process.exit(1);
        }
      } catch (err: any) {
        console.error(`SMD Error: Update run failed: ${err.message}`);
        process.exit(1);
      }
    });
}

export default registerUpdateCommand;
