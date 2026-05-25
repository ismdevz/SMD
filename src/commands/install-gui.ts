import { DesktopManager } from '../managers/desktop-manager.ts';

/**
 * Handles desktop GUI installation by routing to DesktopManager.
 */
export async function installGui(desktopId: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
  return DesktopManager.install(desktopId, options);
}

export default installGui;
