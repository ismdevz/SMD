import { RemoteManager } from '../managers/remote-manager.ts';

/**
 * Handles remote tool installation by routing to RemoteManager.
 */
export async function installRemote(toolId: string, options: { dryRun?: boolean } = {}): Promise<boolean> {
  return RemoteManager.install(toolId, options);
}

export default installRemote;
