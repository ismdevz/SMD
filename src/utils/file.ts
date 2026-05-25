import fs from 'fs';
import path from 'path';
import { logger } from '../core/logger.ts';

/**
 * Checks if a file or directory exists at the given path.
 */
export function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Reads the content of a file as a string. Returns an empty string if reading fails.
 */
export function readFile(filePath: string): string {
  try {
    if (!exists(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  } catch (err: any) {
    logger.error(`Failed to read file ${filePath}: ${err.message}`);
    return '';
  }
}

/**
 * Safely writes text content to a file, creating parent directories if they don't exist.
 */
export function writeFile(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err: any) {
    logger.error(`Failed to write file ${filePath}: ${err.message}`);
    return false;
  }
}

/**
 * Safely writes an object as JSON to a file.
 */
export function writeJson<T>(filePath: string, data: T): boolean {
  return writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Safely reads and parses a JSON file. Returns null on failure.
 */
export function readJson<T>(filePath: string): T | null {
  const content = readFile(filePath);
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch (err: any) {
    logger.error(`Failed to parse JSON file ${filePath}: ${err.message}`);
    return null;
  }
}
