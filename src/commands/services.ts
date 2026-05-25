import { Command } from 'commander';
import { scanCommonServices, detectInitSystem } from '../detectors/services/service-scanner.ts';

export function registerServicesCommand(program: Command): void {
  program
    .command('services')
    .description('List current status of all monitored system services')
    .action(async () => {
      try {
        const init = detectInitSystem();
        const services = await scanCommonServices();

        console.log(`Active Init System: ${init}`);
        console.log('============================================================');
        console.log('SERVICE NAME'.padEnd(25) + 'STATUS');
        console.log('------------------------------------------------------------');
        
        const serviceEntries = Object.entries(services);
        if (serviceEntries.length === 0) {
          console.log('  No common system services detected.');
        } else {
          for (const [name, status] of serviceEntries) {
            console.log(name.padEnd(25) + `[${status.toUpperCase()}]`);
          }
        }
        console.log('============================================================');
      } catch (err: any) {
        console.error(`SMD Error: Failed to scan services: ${err.message}`);
        process.exit(1);
      }
    });
}

export default registerServicesCommand;
