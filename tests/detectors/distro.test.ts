import { describe, expect, test } from 'bun:test';
import { parseOsRelease } from '../../src/utils/os.ts';

describe('OS Release Parser Unit Tests', () => {
  test('should parse active OS details from the host environment', () => {
    const release = parseOsRelease();
    expect(release).toBeDefined();
    expect(typeof release).toBe('object');
    
    // The host should have either an id (like 'ubuntu', 'debian') or be empty if not standard
    if (release.id) {
      expect(typeof release.id).toBe('string');
    }
  });
});
