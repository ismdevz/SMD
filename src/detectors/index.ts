import { detectDistro } from './distro/index.ts';
import { detectPackageManager } from './package-managers/index.ts';
import { detectDesktops } from './desktop/index.ts';
import { detectRemoteTools } from './remote/index.ts';
import { detectInitSystem, scanCommonServices } from './services/service-scanner.ts';
import { detectVirtualization } from './virtualization/index.ts';
import { detectCpu } from './hardware/cpu.ts';
import { detectRam } from './hardware/ram.ts';
import { detectGpu } from './hardware/gpu.ts';
import { detectDisks } from './hardware/disks.ts';
import { detectNetwork } from './hardware/network.ts';
import { Cache } from '../core/cache.ts';
import type { SystemDetails } from '../types/system.ts';

const HW_CACHE_KEY = 'hardware_specs';
const HW_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL for static hardware details

export interface DetectOptions {
  bypassCache?: boolean;
}

/**
 * Aggregates all detectors to compile the full system detection model.
 */
export async function detectSystemDetails(options: DetectOptions = {}): Promise<SystemDetails> {
  const distroInfo = await detectDistro();
  const pkgManager = await detectPackageManager();
  const initSystem = detectInitSystem();

  const desktops = await detectDesktops();
  const remotes = await detectRemoteTools();
  const services = await scanCommonServices();
  const virt = await detectVirtualization();

  // Hardware details (probes like lspci and disk sizes are slow, cache them)
  let hw = options.bypassCache ? null : Cache.get<SystemDetails['hardware']>(HW_CACHE_KEY);

  if (!hw) {
    const cpu = await detectCpu();
    const ram = await detectRam();
    const gpu = await detectGpu();
    const disks = await detectDisks();
    const network = await detectNetwork();

    hw = {
      cpu: cpu.model,
      cores: cpu.cores,
      ram,
      gpu,
      disks,
      network,
    };

    if (!options.bypassCache) {
      Cache.set(HW_CACHE_KEY, hw, HW_CACHE_TTL);
    }
  }

  return {
    distro: `${distroInfo.name} ${distroInfo.version}`.trim(),
    packageManager: pkgManager,
    init: initSystem,
    desktop: desktops,
    remote: remotes,
    services,
    virtualization: virt,
    hardware: hw,
  };
}

export default detectSystemDetails;
