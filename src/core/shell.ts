import { execa, type Options as ExecaOptions } from 'execa';
import { logger } from './logger.ts';

export interface ExecOptions {
  sudo?: boolean;
  dryRun?: boolean;
  shell?: boolean;
  cwd?: string;
  reject?: boolean;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

/**
 * Executes a shell command with the specified options.
 * Log command execution and handles dryRun settings.
 */
export async function execCommand(
  cmd: string,
  args: string[] = [],
  options: ExecOptions = {}
): Promise<ExecResult> {
  const finalArgs = [...args];
  let finalCmd = cmd;

  if (options.sudo) {
    // Check if we already are root
    const isRoot = process.getuid && process.getuid() === 0;
    if (!isRoot) {
      finalArgs.unshift(cmd);
      finalCmd = 'sudo';
    }
  }

  const cmdString = `${finalCmd} ${finalArgs.join(' ')}`;
  logger.debug(`Executing command: ${cmdString}`);

  if (options.dryRun) {
    logger.info(`[DRY-RUN] Would execute: ${cmdString}`);
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
      success: true,
    };
  }

  const execaOpts: ExecaOptions = {
    shell: options.shell ?? false,
    cwd: options.cwd,
    reject: options.reject ?? false,
  };

  try {
    const result = await execa(finalCmd, finalArgs, execaOpts);
    return {
      stdout: String(result.stdout).trim(),
      stderr: String(result.stderr).trim(),
      exitCode: result.exitCode ?? 0,
      success: (result.exitCode ?? 0) === 0,
    };
  } catch (err: any) {
    logger.error(`Command failed: ${cmdString}. Error: ${err.message}`);
    return {
      stdout: err.stdout ? String(err.stdout).trim() : '',
      stderr: err.stderr ? String(err.stderr).trim() : err.message || '',
      exitCode: err.exitCode ?? 1,
      success: false,
    };
  }
}

/**
 * Runs a command directly in the shell. Useful for piped commands.
 */
export async function execShell(
  command: string,
  options: ExecOptions = {}
): Promise<ExecResult> {
  let finalCommand = command;
  if (options.sudo) {
    const isRoot = process.getuid && process.getuid() === 0;
    if (!isRoot) {
      finalCommand = `sudo ${command}`;
    }
  }

  logger.debug(`Executing shell command: ${finalCommand}`);

  if (options.dryRun) {
    logger.info(`[DRY-RUN] Would execute shell command: ${finalCommand}`);
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
      success: true,
    };
  }

  const execaOpts: ExecaOptions = {
    shell: true,
    cwd: options.cwd,
    reject: options.reject ?? false,
  };

  try {
    const result = await execa(finalCommand, execaOpts);
    return {
      stdout: String(result.stdout).trim(),
      stderr: String(result.stderr).trim(),
      exitCode: result.exitCode ?? 0,
      success: (result.exitCode ?? 0) === 0,
    };
  } catch (err: any) {
    logger.error(`Shell command failed: ${finalCommand}. Error: ${err.message}`);
    return {
      stdout: err.stdout ? String(err.stdout).trim() : '',
      stderr: err.stderr ? String(err.stderr).trim() : err.message || '',
      exitCode: err.exitCode ?? 1,
      success: false,
    };
  }
}
