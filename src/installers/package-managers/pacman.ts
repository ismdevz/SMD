import { execCommand } from '../../core/shell.ts';

/**
 * Installs packages using pacman.
 */
export async function install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('pacman', ['-S', '--noconfirm', ...packages], { sudo: true, dryRun: options.dryRun });
  return res.success;
}

/**
 * Refreshes local pacman databases.
 */
export async function update(options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('pacman', ['-Sy'], { sudo: true, dryRun: options.dryRun });
  return res.success;
}
