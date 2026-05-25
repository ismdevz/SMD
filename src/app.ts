import { Command } from 'commander';
import { printBanner } from './cli/banner.ts';
import { configureHelp } from './cli/help.ts';
import { registerCommands } from './cli/registerCommands.ts';

/**
 * Orchestrates CLI program execution, parses options, and runs commands.
 */
export async function run(): Promise<void> {
  const program = new Command();

  program
    .name('smd')
    .description('System Manager Detector — Linux auditor and management tool')
    .version('1.0.0');

  // Handle invalid command calls
  program.on('command:*', () => {
    console.error(`Error: Invalid command "${program.args.join(' ')}".\nRun "smd --help" for usage.`);
    process.exit(1);
  });

  // Custom help setups
  configureHelp(program);

  // Bind commands
  registerCommands(program);

  // Display banner on standard interactive runs unless --json output is requested
  const isJson = process.argv.includes('--json');
  const isHelp = process.argv.includes('-h') || process.argv.includes('--help');
  const mainCommands = ['detect', 'report', 'services', 'status', 'update', 'install', 'uninstall'];
  const hasCommand = process.argv.slice(2).some(arg => mainCommands.includes(arg));

  if (!isJson && (!hasCommand || isHelp || process.argv.length === 2)) {
    printBanner();
  }

  // Parse arguments
  await program.parseAsync(process.argv);
}

export default run;
