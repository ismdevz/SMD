import pino from 'pino';
import path from 'path';
import fs from 'fs';

const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom simple console formatter in case pino-pretty isn't loaded/fails,
// but we'll default to configuring transports if in a standard environment.
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v') || !!process.env.DEBUG;

// Setup logger targets
const targets = [
  {
    target: 'pino-pretty',
    level: isVerbose ? 'debug' : 'info',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:HH:MM:ss',
      destination: 1, // stdout
    },
  },
  {
    target: 'pino/file',
    level: 'debug',
    options: { destination: path.join(logsDir, 'detect.log') },
  },
  {
    target: 'pino/file',
    level: 'error',
    options: { destination: path.join(logsDir, 'errors.log') },
  },
];

export const logger = pino({
  level: 'debug',
  transport: {
    targets: targets,
  },
});

export const installLogger = pino({
  level: 'debug',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: isVerbose ? 'debug' : 'info',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:HH:MM:ss',
          destination: 1,
        },
      },
      {
        target: 'pino/file',
        level: 'debug',
        options: { destination: path.join(logsDir, 'install.log') },
      },
      {
        target: 'pino/file',
        level: 'error',
        options: { destination: path.join(logsDir, 'errors.log') },
      },
    ],
  },
});

export default logger;
