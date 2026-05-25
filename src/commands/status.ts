import { Command } from 'commander';
import { detectSystemDetails } from '../detectors/index.ts';

export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .description('Quick resource capacity metrics and host information summary')
    .action(async () => {
      try {
        const details = await detectSystemDetails({ bypassCache: true }); // Dynamic metrics bypass cache

        console.log('======================================================================');
        console.log('SMD STATUS SUMMARY');
        console.log('======================================================================');
        console.log(`OS Host Distro : ${details.distro}`);
        console.log(`Environment    : ${details.virtualization}`);
        console.log(`System Memory  : Total: ${details.hardware.ram.total} | Free: ${details.hardware.ram.free}`);
        console.log('Disk Storage Mounts:');
        
        if (details.hardware.disks.length === 0) {
          console.log('  No disk drives parsed.');
        } else {
          for (const disk of details.hardware.disks) {
            console.log(
              `  - [${disk.mount.padEnd(8)}] Used: ${disk.used.padEnd(6)} / Total: ${disk.size.padEnd(6)} (${disk.usePercent} used)`
            );
          }
        }
        
        console.log('IP Network Addresses:');
        const netEntries = Object.entries(details.hardware.network);
        if (netEntries.length === 0) {
          console.log('  No network interfaces active.');
        } else {
          for (const [iface, ip] of netEntries) {
            console.log(`  - ${iface.padEnd(10)} : ${ip}`);
          }
        }
        console.log('======================================================================');
      } catch (err: any) {
        console.error(`SMD Error: Status fetch failed: ${err.message}`);
        process.exit(1);
      }
    });
}

export default registerStatusCommand;
