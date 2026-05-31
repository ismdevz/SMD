import { build as esBuild } from 'esbuild';
import { chmodSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function build() {
  console.log('Building Node.js compatible bundle...');
  const distDir = path.resolve(__dirname, '../dist');
  // Write to .cjs first so local "type:module" package.json doesn't treat it as ESM
  const cjsFile = path.join(distDir, 'smd.cjs');
  const outfile = path.join(distDir, 'smd.js');

  try {
    await esBuild({
      entryPoints: [path.resolve(__dirname, '../bin/smd.ts')],
      outfile: cjsFile,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      minify: false,
    });

    // Strip any shebangs esbuild or the source added, then write one clean shebang
    let content = readFileSync(cjsFile, 'utf8');
    content = content.replace(/^#!.*\r?\n/gm, '');
    const finalContent = '#!/usr/bin/env node\n' + content;

    // Write final smd.js (for remote upload) and keep smd.cjs as the local runnable copy
    writeFileSync(outfile, finalContent, 'utf8');
    writeFileSync(cjsFile, finalContent, 'utf8');

    chmodSync(outfile, 0o755);
    chmodSync(cjsFile, 0o755);
    console.log('Successfully built dist/smd.js and dist/smd.cjs!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
