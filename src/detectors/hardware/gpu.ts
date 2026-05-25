import { execCommand } from '../../core/shell.ts';

/**
 * Detects installed GPUs by inspecting PCI devices and nvidia-smi if present.
 */
export async function detectGpu(): Promise<string[]> {
  const gpus: string[] = [];

  // 1. Try probing PCI devices using lspci
  const lspciRes = await execCommand('lspci');
  if (lspciRes.success) {
    const lines = lspciRes.stdout.split('\n');
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('vga') || lowerLine.includes('3d controller') || lowerLine.includes('display controller')) {
        // Extract the GPU vendor/product details (usually following the controller class name)
        const colonIndex = line.indexOf('controller:');
        if (colonIndex !== -1) {
          gpus.push(line.substring(colonIndex + 11).trim());
        } else {
          const parts = line.split(':');
          gpus.push(parts[parts.length - 1].trim());
        }
      }
    }
  }

  // 2. If no PCI GPU detected, check nvidia-smi for Nvidia cards
  if (gpus.length === 0) {
    const nvidiaRes = await execCommand('nvidia-smi', ['--query-gpu=name', '--format=csv,noheader']);
    if (nvidiaRes.success && nvidiaRes.stdout.trim()) {
      const nvidiaGpus = nvidiaRes.stdout
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
      gpus.push(...nvidiaGpus);
    }
  }

  // 3. Check for VirtIO/hypervisor GPU devices
  if (gpus.length === 0) {
    const dmesgRes = await execCommand('dmesg');
    if (dmesgRes.success && dmesgRes.stdout.toLowerCase().includes('virtio-gpu')) {
      gpus.push('VirtIO GPU (Virtual)');
    }
  }

  return gpus;
}
