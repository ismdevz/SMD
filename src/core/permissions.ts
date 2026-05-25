import { execShell } from './shell.ts';
import { logger } from './logger.ts';

/**
 * Checks if the current process is running as root (UID 0).
 */
export function isRoot(): boolean {
  const uid = process.getuid ? process.getuid() : -1;
  return uid === 0;
}

/**
 * Checks if the user can execute commands via sudo without a password prompt.
 */
export async function hasSudoPrivilege(): Promise<boolean> {
  if (isRoot()) return true;

  try {
    // -n option tells sudo to run non-interactively (do not prompt for password)
    const result = await execShell('sudo -n true');
    return result.success;
  } catch (err) {
    return false;
  }
}

/**
 * Ensures that the process is running as root or has sudo access, throwing an error otherwise.
 */
export async function enforceRootOrSudo(): Promise<void> {
  if (isRoot()) {
    return;
  }

  const hasSudo = await hasSudoPrivilege();
  if (!hasSudo) {
    const errMsg = 'This action requires root/administrator privileges. Please run as root or ensure your user has passwordless sudo access.';
    logger.error(errMsg);
    throw new Error(errMsg);
  }
}
