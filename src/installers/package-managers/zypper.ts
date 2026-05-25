import { execCommand } from '../../core/shell.ts';

/**
 * Installs packages using zypper.
 */
export async function install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('zypper', ['install', '-y', ...packages], { sudo: true, dryRun: options.dryRun });
  return res.success;
}

/**
 * Refreshes local zypper repositories.
 */
export async function update(options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('zypper', ['refresh'], { sudo: true, dryRun: options.dryRun });
  return res.success;
}
