import { execCommand } from '../../core/shell.ts';

/**
 * Installs packages using dnf.
 */
export async function install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('dnf', ['install', '-y', ...packages], { sudo: true, dryRun: options.dryRun });
  return res.success;
}

/**
 * Refreshes local dnf metadata.
 */
export async function update(options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('dnf', ['makecache'], { sudo: true, dryRun: options.dryRun });
  return res.success;
}
