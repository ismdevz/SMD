import { build as esBuild } from 'esbuild';
import { chmodSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function build() {
  console.log('Building Node.js compatible bundle...');
  const distDir = path.resolve(__dirname, '../dist');
  const outfile = path.join(distDir, 'smd.js');

  try {
    await esBuild({
      entryPoints: [path.resolve(__dirname, '../bin/smd.ts')],
      outfile: outfile,
      bundle: true,
      platform: 'node',
      format: 'esm',
      minify: false,
      banner: {
        js: '#!/usr/bin/env node',
      },
    });

    // Make it executable
    chmodSync(outfile, 0o755);
    console.log('Successfully built and configured shebang for dist/smd.js!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
