import type { Command } from 'commander';
import { registerDetectCommand } from '../commands/detect.ts';
import { registerReportCommand } from '../commands/report.ts';
import { registerInstallCommand } from '../commands/install.ts';
import { registerUninstallCommand } from '../commands/uninstall.ts';
import { registerServicesCommand } from '../commands/services.ts';
import { registerStatusCommand } from '../commands/status.ts';
import { registerUpdateCommand } from '../commands/update.ts';

/**
 * Registers all commands on the main Commander application program instance.
 */
export function registerCommands(program: Command): void {
  registerDetectCommand(program);
  registerReportCommand(program);
  registerInstallCommand(program);
  registerUninstallCommand(program);
  registerServicesCommand(program);
  registerStatusCommand(program);
  registerUpdateCommand(program);
}

export default registerCommands;
