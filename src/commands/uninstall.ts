import { Command } from 'commander';
import { detectPackageManager } from '../detectors/package-managers/index.ts';
import { DESKTOP_PACKAGES } from '../constants/desktop-packages.ts';
import { REMOTE_PACKAGES } from '../constants/remote-packages.ts';
import { execCommand, execShell } from '../core/shell.ts';
import { enforceRootOrSudo } from '../core/permissions.ts';

/**
 * Glob patterns for wildcard purge of all related packages (apt only).
 * Covers the DE's core shell, session, window manager, file manager,
 * display manager, themes, and all pulled-in libraries.
 */
const DESKTOP_PURGE_PATTERNS: Record<string, string[]> = {
  kde: [
    'kde-*', 'kdeplasma-*', 'kdebase-*',
    'plasma-*', 'kwin-*', 'kscreenlocker',
    'ksmserver', 'kpackage', 'kpackagetool5',
    'kwallet*', 'kwayland*', 'kactivitymanagerd',
    'baloo*', 'breeze*', 'dolphin*',
    'akonadi*', 'phonon*', 'okular',
    'konsole', 'kate', 'ark', 'gwenview',
    'spectacle', 'ksysguard', 'drkonqi',
    'kwrited', 'kdeconnect', 'sddm*',
    'libkf5*', 'libkf6*', 'libplasma*',
    'qml-module-org-kde*', 'libkgapi*',
  ],

  gnome: [
    'gnome-*', 'libgnome*', 'gir1.2-gnome*',
    'gdm3', 'nautilus*', 'gnome-shell*',
    'gnome-session*', 'mutter*', 'libmutter*',
    'evolution*', 'epiphany*', 'gvfs*',
    'gjs', 'gnome-bluetooth*',
    'gnome-software*', 'totem*', 'rhythmbox*',
    'cheese*', 'gnome-maps*', 'gnome-photos*',
    'gnome-clocks*', 'gnome-contacts*',
    'gedit*', 'eog*', 'evince*',
    'glib-networking*', 'libgdata*',
  ],

  xfce: [
    'xfce4*', 'xfdesktop4*', 'xfwm4*',
    'xfce-*', 'libxfce4*', 'xfconf*',
    'thunar*', 'tumbler*', 'mousepad',
    'parole', 'ristretto', 'xfburn',
    'xfce4-terminal*', 'xfce4-panel*',
    'xfce4-session*', 'xfce4-settings*',
    'xfce4-appfinder*', 'xfce4-power-manager*',
    'xfce4-screensaver*', 'xfce4-screenshooter*',
    'xfce4-notifyd*', 'xfce4-taskmanager*',
    'xfce4-goodies', 'xfce4-whiskermenu*',
  ],

  mate: [
    'mate-*', 'libmate*', 'caja*',
    'marco*', 'pluma', 'atril*',
    'mate-panel*', 'mate-session*',
    'mate-desktop*', 'mate-settings*',
    'mate-control-center*', 'mate-system-monitor*',
    'mate-terminal*', 'mate-applets*',
    'mate-media*', 'mate-power-manager*',
    'mate-screensaver*', 'mate-utils*',
    'mate-indicator-applet*', 'mate-themes*',
    'mate-icon-theme*', 'mate-backgrounds*',
    'mozo', 'eom',
  ],

  cinnamon: [
    'cinnamon*', 'nemo*', 'muffin*',
    'mintmenu*', 'libcinnamon*',
    'mint-common*', 'cinnamon-desktop*',
    'cinnamon-settings*', 'cinnamon-session*',
    'cinnamon-control-center*', 'cinnamon-screensaver*',
    'python3-tinycss2', 'python3-xapp*',
    'xapps*', 'libxapp*',
  ],
};

/**
 * Leftover directories to forcibly delete after package removal for remote tools.
 */
const REMOTE_PURGE_DIRS: Record<string, string[]> = {
  nomachine: [
    '/usr/NX',
    '/etc/NX',
    '/usr/bin/nxserver',
    '/usr/bin/nxplayer',
    '/usr/bin/nxclient',
    '/usr/share/doc/nomachine*',
    '/var/run/nxserver*',
    '/var/log/NX',
    '/var/lib/nxserver*',
    '/tmp/.X11-unix/NX_*',
  ],
};

/**
 * Leftover directories to forcibly delete after package removal for each DE.
 */
const DESKTOP_PURGE_DIRS: Record<string, string[]> = {
  kde: [
    '/etc/kde*', '/etc/sddm.conf', '/etc/sddm.conf.d',
    '/usr/share/kde*', '/usr/share/plasma*',
    '/usr/share/sddm*', '/usr/share/apps/kde*',
    '/usr/lib/plasma*', '/usr/lib/x86_64-linux-gnu/plasma*',
    '/usr/lib/aarch64-linux-gnu/plasma*',
    '/var/lib/sddm', '/usr/share/akonadi*',
    '/usr/share/kwin*', '/usr/share/kf5*',
  ],

  gnome: [
    '/etc/gnome*', '/etc/gdm3',
    '/usr/share/gnome*', '/usr/share/gnome-shell*',
    '/usr/share/nautilus*', '/usr/share/mutter*',
    '/var/lib/gdm3', '/var/cache/gdm*',
    '/usr/share/themes/Adwaita', '/usr/share/icons/Adwaita',
  ],

  xfce: [
    '/etc/xfce4*', '/etc/xdg/xfce4',
    '/usr/share/xfce4*', '/usr/share/xfdesktop*',
    '/usr/share/themes/Default', '/usr/share/thunar*',
    '/usr/lib/x86_64-linux-gnu/xfce4*',
    '/usr/lib/aarch64-linux-gnu/xfce4*',
  ],

  mate: [
    '/etc/mate*', '/etc/xdg/mate',
    '/usr/share/mate*', '/usr/share/caja*',
    '/usr/share/pixmaps/mate*',
    '/usr/lib/x86_64-linux-gnu/mate*',
    '/usr/lib/aarch64-linux-gnu/mate*',
  ],

  cinnamon: [
    '/etc/cinnamon*', '/etc/xdg/cinnamon*',
    '/usr/share/cinnamon*', '/usr/share/themes/cinnamon*',
    '/usr/lib/cinnamon*',
    '/usr/lib/x86_64-linux-gnu/cinnamon*',
    '/usr/lib/aarch64-linux-gnu/cinnamon*',
    '/usr/share/nemo*',
    '/usr/lib/x86_64-linux-gnu/nemo*',
  ],
};

export function registerUninstallCommand(program: Command): void {
  program
    .command('uninstall <target>')
    .description('Fully purge a desktop environment or remote desktop tool and all associated packages/dirs')
    .option('--dry-run', 'Preview package removal commands without executing them')
    .action(async (target, options) => {
      const lowerTarget = target.toLowerCase();
      const desktop = DESKTOP_PACKAGES.find(d => d.id === lowerTarget);
      const remote = REMOTE_PACKAGES.find(r => r.id === lowerTarget);

      if (!desktop && !remote) {
        console.error(`SMD Error: "${target}" is not recognized as a supported Desktop Environment or Remote Tool.`);
        process.exit(1);
      }

      const pm = await detectPackageManager();
      if (pm === 'unknown') {
        console.error('SMD Error: Unknown/unsupported package manager.');
        process.exit(1);
      }

      const packages = desktop
        ? (desktop.packages as Record<string, string[]>)[pm] || []
        : (remote!.packages as Record<string, string[]>)[pm] || [];

      if (packages.length === 0) {
        console.log(`SMD: No packages mapped for removal of "${target}" using ${pm}.`);
        return;
      }

      if (!options.dryRun) {
        await enforceRootOrSudo();
      }

      // ── Step 1: Purge listed metapackages ─────────────────────────────
      console.log(`SMD: [1/4] Purging base packages: ${packages.join(', ')}...`);
      await runPurge(pm, packages, !!options.dryRun);

      // ── Step 2: Wildcard purge of ALL related packages (apt only) ─────
      if (pm === 'apt' && desktop && DESKTOP_PURGE_PATTERNS[lowerTarget]) {
        const patterns = DESKTOP_PURGE_PATTERNS[lowerTarget];
        console.log(`SMD: [2/4] Wildcard-purging all related ${lowerTarget.toUpperCase()} packages...`);
        for (const pattern of patterns) {
          // List currently installed packages matching the glob
          const listCmd = `dpkg -l '${pattern}' 2>/dev/null | awk '/^ii/{print $2}' | tr '\\n' ' '`;
          const list = await execShell(listCmd, { dryRun: !!options.dryRun });
          const pkgs = list.stdout.trim();
          if (pkgs) {
            console.log(`SMD:   Purging pattern '${pattern}': ${pkgs}`);
            await execShell(
              `DEBIAN_FRONTEND=noninteractive apt-get purge -y ${pkgs}`,
              { sudo: true, dryRun: !!options.dryRun }
            );
          }
        }
      }

      // ── Step 3: Autoremove all orphaned / pulled-in dependencies ──────
      console.log(`SMD: [3/4] Removing orphaned dependencies...`);
      if (pm === 'apt') {
        await execShell(
          'DEBIAN_FRONTEND=noninteractive apt-get autoremove --purge -y',
          { sudo: true, dryRun: !!options.dryRun }
        );
        await execShell(
          'DEBIAN_FRONTEND=noninteractive apt-get autoclean -y',
          { sudo: true, dryRun: !!options.dryRun }
        );
      } else if (pm === 'dnf') {
        await execCommand('dnf', ['autoremove', '-y'], { sudo: true, dryRun: !!options.dryRun });
      } else if (pm === 'pacman') {
        const orphansRes = await execShell('pacman -Qdtq 2>/dev/null', { dryRun: !!options.dryRun });
        const orphans = orphansRes.stdout.trim();
        if (orphans) {
          await execShell(`pacman -Rns --noconfirm ${orphans}`, { sudo: true, dryRun: !!options.dryRun });
        }
      }

      // ── Step 4: Delete leftover config/data/lib dirs ──────────────────
      let purgeDirs: string[] | undefined;
      if (desktop) {
        purgeDirs = DESKTOP_PURGE_DIRS[lowerTarget];
      } else if (remote) {
        purgeDirs = REMOTE_PURGE_DIRS[lowerTarget];
      }

      if (purgeDirs) {
        console.log(`SMD: [4/4] Removing leftover ${lowerTarget.toUpperCase()} directories...`);
        for (const dir of purgeDirs) {
          await execShell(`rm -rf ${dir}`, { sudo: true, dryRun: !!options.dryRun });
        }
      } else {
        console.log(`SMD: [4/4] No leftover directories to clean for "${target}".`);
      }

      console.log(`SMD: Fully purged "${target}" — all packages, libraries, config, and directories removed.`);
    });
}

async function runPurge(pm: string, packages: string[], dryRun: boolean): Promise<void> {
  switch (pm) {
    case 'apt':
      await execShell(
        `DEBIAN_FRONTEND=noninteractive apt-get purge --autoremove -y ${packages.join(' ')}`,
        { sudo: true, dryRun }
      );
      break;
    case 'dnf':
      await execCommand('dnf', ['remove', '-y', ...packages], { sudo: true, dryRun });
      break;
    case 'yum':
      await execCommand('yum', ['remove', '-y', ...packages], { sudo: true, dryRun });
      break;
    case 'pacman':
      await execCommand('pacman', ['-Rns', '--noconfirm', ...packages], { sudo: true, dryRun });
      break;
    case 'apk':
      await execCommand('apk', ['del', '--purge', ...packages], { sudo: true, dryRun });
      break;
    case 'zypper':
      await execCommand('zypper', ['remove', '--clean-deps', '-y', ...packages], { sudo: true, dryRun });
      break;
  }
}

export default registerUninstallCommand;
