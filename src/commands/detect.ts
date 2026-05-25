import { Command } from 'commander';
import { detectSystemDetails } from '../detectors/index.ts';

export function registerDetectCommand(program: Command): void {
  program
    .command('detect')
    .description('Inspect distro, package manager, desktop environments, remote tools, and hardware specifications')
    .option('--json', 'Output results in raw JSON format')
    .option('--no-cache', 'Bypass the local hardware specifications cache')
    .action(async (options) => {
      try {
        const details = await detectSystemDetails({ bypassCache: !options.cache });
        if (options.json) {
          console.log(JSON.stringify(details, null, 2));
        } else {
          console.log('======================================================================');
          console.log('SMD — SYSTEM MANAGER DETECT');
          console.log('======================================================================');
          console.log(`OS Distro       : ${details.distro}`);
          console.log(`Package Manager : ${details.packageManager}`);
          console.log(`Init System     : ${details.init}`);
          console.log(`Virtualization  : ${details.virtualization}`);
          console.log(`Desktops        : ${details.desktop.join(', ') || 'None detected'}`);
          console.log(`Remote Tools    : ${details.remote.join(', ') || 'None detected'}`);
          console.log(`Running Services: ${Object.entries(details.services)
            .map(([s, st]) => `${s}(${st})`)
            .join(', ') || 'None'}`);
          console.log('----------------------------------------------------------------------');
          console.log(`CPU Model       : ${details.hardware.cpu}`);
          console.log(`CPU Cores       : ${details.hardware.cores}`);
          console.log(`RAM Usage       : Free: ${details.hardware.ram.free} / Total: ${details.hardware.ram.total}`);
          console.log('======================================================================');
        }
      } catch (err: any) {
        console.error(`Detection error: ${err.message}`);
        process.exit(1);
      }
    });
}

export default registerDetectCommand;
