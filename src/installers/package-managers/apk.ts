import { execCommand } from '../../core/shell.ts';

/**
 * Installs packages using apk.
 */
export async function install(packages: string[], options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('apk', ['add', ...packages], { sudo: true, dryRun: options.dryRun });
  return res.success;
}

/**
 * Refreshes local apk registries.
 */
export async function update(options: { dryRun?: boolean } = {}): Promise<boolean> {
  const res = await execCommand('apk', ['update'], { sudo: true, dryRun: options.dryRun });
  return res.success;
}
