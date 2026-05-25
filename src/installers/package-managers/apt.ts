import { execCommand } from '../../core/shell.ts';

/**
 * Installs packages using apt-get.
 */
export async function install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('apt-get', ['install', '-y', ...packages], { sudo: true, dryRun: options.dryRun });
  return res.success;
}

/**
 * Refreshes local apt package lists.
 */
export async function update(options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('apt-get', ['update'], { sudo: true, dryRun: options.dryRun });
  return res.success;
}
