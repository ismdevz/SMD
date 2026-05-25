import { readFile } from '../../utils/file.ts';
import { execCommand } from '../../core/shell.ts';

export async function detectVmware(): Promise<boolean> {
  const product = readFile('/sys/class/dmi/id/product_name').toLowerCase();
  const vendor = readFile('/sys/class/dmi/id/sys_vendor').toLowerCase();

  if (product.includes('vmware') || vendor.includes('vmware')) {
    return true;
  }

  const detectVirt = await execCommand('systemd-detect-virt');
  if (detectVirt.success && detectVirt.stdout.toLowerCase().includes('vmware')) {
    return true;
  }

  return false;
}
