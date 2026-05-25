#!/usr/bin/env bun
import { run } from '../src/app.ts';

// Bootstrap the commander CLI application
run().catch((err) => {
  console.error('Fatal CLI execution error:', err);
  process.exit(1);
});
