import { detectDocker } from './docker.ts';
import { detectLxc } from './lxc.ts';
import { detectKvm } from './kvm.ts';
import { detectVmware } from './vmware.ts';
import { detectProxmox } from './proxmox.ts';
import { execCommand } from '../../core/shell.ts';

/**
 * Detects the active virtualization or container environment of the system.
 */
export async function detectVirtualization(): Promise<string> {
  if (await detectDocker()) {
    return 'Docker';
  }
  if (await detectLxc()) {
    return 'LXC';
  }
  if (await detectProxmox()) {
    return 'Proxmox VE';
  }
  if (await detectKvm()) {
    return 'KVM';
  }
  if (await detectVmware()) {
    return 'VMware';
  }

  // Fallback to systemd-detect-virt to catch other virtualization technologies
  const detectVirt = await execCommand('systemd-detect-virt');
  if (detectVirt.success) {
    const output = detectVirt.stdout.trim().toLowerCase();
    if (output && output !== 'none') {
      if (output === 'oracle' || output === 'vbox') return 'VirtualBox';
      if (output === 'microsoft' || output === 'hyperv') return 'Hyper-V';
      if (output === 'xen') return 'Xen';
      if (output === 'wsl') return 'WSL';
      return output.charAt(0).toUpperCase() + output.slice(1);
    }
  }

  return 'Physical';
}

export default detectVirtualization;
