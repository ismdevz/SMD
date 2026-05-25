import type { Command } from 'commander';

/**
 * Attaches customized help templates and stack recommendations to the Commander program.
 */
export function configureHelp(program: Command): void {
  program.addHelpText(
    'after',
    `
======================================================================
Example Commands:
  $ smd detect               Inspect and output host details
  $ smd detect --json        Serialize full inspection result to JSON
  $ smd report               Generate HTML-like files under reports/
  $ smd status               Examine resource utilization metrics
  $ smd services             Probe status of monitored services
  $ smd install xfce         Install lightweight desktop environment
  $ smd install nomachine    Setup high-performance NoMachine remote
  $ smd uninstall tigervnc   Purge VNC packages from host

Recommended Setup Stacks:
  - Lightweight VPS          : XFCE + TigerVNC + noVNC
  - High Performance Remote  : KDE Plasma + NoMachine
  - Best Overall Host Setup  : XFCE + NoMachine
======================================================================
`
  );
}

export default configureHelp;
