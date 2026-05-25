import fs from 'fs';
import { readFile } from '../../utils/file.ts';

export async function detectProxmox(): Promise<boolean> {
  // Check if this system is a Proxmox host (PVE environment)
  if (fs.existsSync('/etc/pve') || fs.existsSync('/usr/bin/pvesubscription')) {
    return true;
  }

  // Check if this is a VM spawned by Proxmox (QEMU/KVM with Proxmox BIOS/Board details)
  const boardVendor = readFile('/sys/class/dmi/id/board_vendor').toLowerCase();
  const biosVendor = readFile('/sys/class/dmi/id/bios_vendor').toLowerCase();

  if (boardVendor.includes('proxmox') || biosVendor.includes('proxmox')) {
    return true;
  }

  return false;
}
