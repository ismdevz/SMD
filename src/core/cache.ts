import path from 'path';
import fs from 'fs';
import { logger } from './logger.ts';

const CACHE_DIR = path.resolve(process.cwd(), 'storage/cache');

export interface CacheEntry<T> {
  value: T;
  expiry: number; // timestamp
}

export class Cache {
  private static getFilePath(key: string): string {
    // Replace non-alphanumeric chars to ensure a safe filename
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(CACHE_DIR, `${safeKey}.json`);
  }

  /**
   * Sets a cache value with a specific TTL (time-to-live) in milliseconds.
   */
  static set<T>(key: string, value: T, ttlMs: number): void {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      const entry: CacheEntry<T> = {
        value,
        expiry: Date.now() + ttlMs,
      };
      fs.writeFileSync(this.getFilePath(key), JSON.stringify(entry, null, 2), 'utf8');
      logger.debug(`Cache set for key: ${key} (TTL: ${ttlMs}ms)`);
    } catch (err: any) {
      logger.error(`Failed to write cache for key "${key}": ${err.message}`);
    }
  }

  /**
   * Retrieves a value from cache, returning null if it doesn't exist or is expired.
   */
  static get<T>(key: string): T | null {
    try {
      const filePath = this.getFilePath(key);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const entry = JSON.parse(content) as CacheEntry<T>;

      if (Date.now() > entry.expiry) {
        logger.debug(`Cache expired for key: ${key}`);
        fs.unlinkSync(filePath); // Clean up expired cache file
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return entry.value;
    } catch (err: any) {
      logger.error(`Failed to read cache for key "${key}": ${err.message}`);
      return null;
    }
  }

  /**
   * Deletes a cache entry.
   */
  static delete(key: string): void {
    try {
      const filePath = this.getFilePath(key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.debug(`Cache deleted for key: ${key}`);
      }
    } catch (err: any) {
      logger.error(`Failed to delete cache for key "${key}": ${err.message}`);
    }
  }

  /**
   * Clears all cache files.
   */
  static clear(): void {
    try {
      if (fs.existsSync(CACHE_DIR)) {
        const files = fs.readdirSync(CACHE_DIR);
        for (const file of files) {
          if (file.endsWith('.json')) {
            fs.unlinkSync(path.join(CACHE_DIR, file));
          }
        }
        logger.info('Cache cleared successfully.');
      }
    } catch (err: any) {
      logger.error(`Failed to clear cache: ${err.message}`);
    }
  }
}

export default Cache;
