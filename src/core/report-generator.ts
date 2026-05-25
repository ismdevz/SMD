import path from 'path';
import fs from 'fs';
import { detectSystemDetails } from '../detectors/index.ts';
import { writeFile, writeJson } from '../utils/file.ts';
import { logger } from './logger.ts';
import type { SystemDetails } from '../types/system.ts';

const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
const HISTORY_DIR = path.join(REPORTS_DIR, 'history');

/**
 * Executes a full system scan, writes report history and latest summaries.
 */
export async function generateReport(): Promise<{
  jsonPath: string;
  txtPath: string;
  details: SystemDetails;
}> {
  // Guarantee folders exist
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }

  logger.info('Generating system manager detection report...');
  const details = await detectSystemDetails({ bypassCache: true }); // Always bypass cache for actual report generation

  const timestamp = new Date()
    .toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');

  const latestJsonPath = path.join(REPORTS_DIR, 'latest.json');
  const latestTxtPath = path.join(REPORTS_DIR, 'latest.txt');
  const historyJsonPath = path.join(HISTORY_DIR, `report_${timestamp}.json`);
  const historyTxtPath = path.join(HISTORY_DIR, `report_${timestamp}.txt`);

  // Write JSON reports
  writeJson(latestJsonPath, details);
  writeJson(historyJsonPath, details);

  // Write Text reports
  const txtContent = formatTxtReport(details);
  writeFile(latestTxtPath, txtContent);
  writeFile(historyTxtPath, txtContent);

  logger.info(`System report files created:\n- JSON: ${latestJsonPath}\n- TEXT: ${latestTxtPath}`);

  return {
    jsonPath: latestJsonPath,
    txtPath: latestTxtPath,
    details,
  };
}

/**
 * Standard formatted textual report.
 */
export function formatTxtReport(details: SystemDetails): string {
  const border = '='.repeat(70);
  const sectionBorder = '-'.repeat(70);

  const desktopsStr = details.desktop.length > 0 ? details.desktop.join(', ') : 'None detected';
  const remotesStr = details.remote.length > 0 ? details.remote.join(', ') : 'None detected';

  const servicesStr =
    Object.entries(details.services)
      .map(([svc, status]) => `  - ${svc.padEnd(20)}: [${status.toUpperCase()}]`)
      .join('\n') || '  No common services running.';

  const gpuStr =
    details.hardware.gpu.map(gpu => `  - ${gpu}`).join('\n') || '  No dedicated GPU detected.';

  const diskStr =
    details.hardware.disks
      .map(
        d =>
          `  - ${d.mount.padEnd(12)} Space: ${d.size.padEnd(8)} Used: ${d.used.padEnd(8)} Free: ${d.avail.padEnd(8)} (Used%: ${d.usePercent})`
      )
      .join('\n') || '  No disk drives detected.';

  const networkStr =
    Object.entries(details.hardware.network)
      .map(([iface, ip]) => `  - ${iface.padEnd(12)}: ${ip}`)
      .join('\n') || '  No active network interfaces.';

  return `${border}
SMD — SYSTEM MANAGER DETECTOR REPORT
Generated on: ${new Date().toLocaleString()}
${border}

OS & ENVIRONMENT
  Distro          : ${details.distro}
  Package Manager : ${details.packageManager}
  Init System     : ${details.init}
  Virtualization  : ${details.virtualization}

DESKTOP & REMOTE INFRASTRUCTURE
  Desktops        : ${desktopsStr}
  Remote Tools    : ${remotesStr}

${sectionBorder}
MONITORED SYSTEM SERVICES
${servicesStr}

${sectionBorder}
HARDWARE SPECIFICATIONS
  CPU Model       : ${details.hardware.cpu}
  CPU Cores       : ${details.hardware.cores}
  RAM (Total)     : ${details.hardware.ram.total}
  RAM (Free)      : ${details.hardware.ram.free}

Graphics Processing Units:
${gpuStr}

Disk Space Usage:
${diskStr}

Network Interface IPs:
${networkStr}
${border}
`;
}
export default generateReport;
