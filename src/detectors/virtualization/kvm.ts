import { readFile } from '../../utils/file.ts';
import { execCommand } from '../../core/shell.ts';

export async function detectKvm(): Promise<boolean> {
  // Check DMI info
  const product = readFile('/sys/class/dmi/id/product_name').toLowerCase();
  const vendor = readFile('/sys/class/dmi/id/sys_vendor').toLowerCase();

  if (
    product.includes('kvm') ||
    product.includes('qemu') ||
    vendor.includes('qemu') ||
    vendor.includes('red hat')
  ) {
    return true;
  }

  // Fallback to systemd-detect-virt utility
  const detectVirt = await execCommand('systemd-detect-virt');
  if (
    detectVirt.success &&
    (detectVirt.stdout.toLowerCase().includes('kvm') || detectVirt.stdout.toLowerCase().includes('qemu'))
  ) {
    return true;
  }

  // Check cpuinfo flags for hypervisor
  const cpuinfo = readFile('/proc/cpuinfo');
  if (cpuinfo.includes('hypervisor') && (cpuinfo.includes('QEMU') || cpuinfo.includes('KVM'))) {
    return true;
  }

  return false;
}
