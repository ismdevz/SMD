import { Command } from 'commander';
import { generateReport } from '../core/report-generator.ts';

export function registerReportCommand(program: Command): void {
  program
    .command('report')
    .description('Execute full inspection scan and write system report files to directory')
    .action(async () => {
      try {
        const result = await generateReport();
        console.log('SMD: Report generated successfully.');
        console.log(`- Text version: ${result.txtPath}`);
        console.log(`- JSON version: ${result.jsonPath}`);
      } catch (err: any) {
        console.error(`SMD Error: Failed to generate report: ${err.message}`);
        process.exit(1);
      }
    });
}

export default registerReportCommand;
