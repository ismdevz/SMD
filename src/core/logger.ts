import fs from 'fs';
import path from 'path';
import os from 'os';

const logsDir = path.join(os.homedir(), '.smd', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v') || !!process.env.DEBUG;
const isJson = process.argv.includes('--json');

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const minLevel: Level = isVerbose ? 'debug' : 'info';

function timestamp(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

function writeLog(level: Level, msg: string, logFile: string): void {
  const line = `[${timestamp()}] ${level.toUpperCase()} ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch { /* ignore */ }
}

function makeLogger(logFile: string, errorFile: string) {
  function log(level: Level, msg: string, extra?: unknown): void {
    const extraStr = extra !== undefined ? ' ' + JSON.stringify(extra) : '';
    const fullMsg = msg + extraStr;

    // Write to log file always (debug+)
    writeLog(level, fullMsg, logFile);

    // Write errors to error file too
    if (LEVELS[level] >= LEVELS['error']) {
      writeLog(level, fullMsg, errorFile);
    }

    // Print to stdout only when not in --json mode and level >= minLevel
    if (!isJson && LEVELS[level] >= LEVELS[minLevel]) {
      const prefix = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : level === 'debug' ? '\x1b[36m' : '\x1b[32m';
      process.stdout.write(`${prefix}[${timestamp()}]\x1b[0m ${fullMsg}\n`);
    }
  }

  return {
    debug: (msg: string, extra?: unknown) => log('debug', msg, extra),
    info:  (msg: string, extra?: unknown) => log('info',  msg, extra),
    warn:  (msg: string, extra?: unknown) => log('warn',  msg, extra),
    error: (msg: string, extra?: unknown) => log('error', msg, extra),
  };
}

const errorsLog = path.join(logsDir, 'errors.log');

export const logger = makeLogger(
  path.join(logsDir, 'detect.log'),
  errorsLog,
);

export const installLogger = makeLogger(
  path.join(logsDir, 'install.log'),
  errorsLog,
);

export default logger;
