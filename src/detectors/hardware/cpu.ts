import os from 'os';
import { readFile } from '../../utils/file.ts';

/**
 * Detects the CPU model and the number of processor cores.
 */
export async function detectCpu(): Promise<{ model: string; cores: number }> {
  const cpus = os.cpus();
  let model = cpus[0]?.model || 'Unknown CPU';
  let cores = cpus.length || 1;

  // Fallback to manual /proc/cpuinfo parsing if os.cpus() is empty or generic
  if (model === 'Unknown CPU' || model.includes('unknown')) {
    const cpuinfo = readFile('/proc/cpuinfo');
    if (cpuinfo) {
      const modelLine = cpuinfo.split('\n').find(line => line.toLowerCase().includes('model name'));
      if (modelLine) {
        model = modelLine.split(':')[1]?.trim() || model;
      }
      
      const processorLines = cpuinfo.split('\n').filter(line => line.toLowerCase().startsWith('processor'));
      if (processorLines.length > 0) {
        cores = processorLines.length;
      }
    }
  }

  return {
    model: model.replace(/\s+/g, ' ').trim(),
    cores,
  };
}
