# SMD — System Manager Detector

`smd` is a powerful system auditing and management tool for Linux environments. It detects distribution details, system managers, package managers, desktop environments, remote desktop tools, running services, and hardware specifications. It also provides automated installers and uninstallers for various remote environments and desktop shells.

---

## Table of Contents

1. [Features & Supported Distros](#features--supported-distros)
2. [Prerequisites](#prerequisites)
3. [Installation & Development](#installation--development)
4. [CLI Reference](#cli-reference)
5. [Building & Compiling](#building--compiling)
6. [Publishing](#publishing)
7. [Recommended Setup Stacks](#recommended-setup-stacks)

---

## Features & Supported Distros

- **Comprehensive Distro Support**: Audit and identify the active Linux distribution with dedicated support for:
  - Ubuntu (`ubuntu`)
  - Debian (`debian`)
  - Arch Linux (`archlinux`)
  - Fedora (`fedora`)
  - openSUSE (`opensuse`)
  - Manjaro Linux (`manjaro`)
  - Kali Linux (`kali`)
  - Linux Mint (`linuxmint`)
  - Pop!_OS (`popos`)
  - Red Hat Enterprise Linux (`rhel`)
  - CentOS (`centos`)
  - Rocky Linux (`rocky`)
  - AlmaLinux (`almalinux`)
  - Alpine Linux (`alpine`)
  - Gentoo Linux (`gentoo`)
  - NixOS (`nixos`)
- **System Diagnostics**: Identify the active initialization system (systemd, sysvinit, etc.), package manager (apt, dnf, pacman, apk, zypper, yum), and virtualization layer.
- **Hardware Audit**: Retrieve CPU models, core count, real-time RAM metrics, graphics cards (GPU), active network interfaces/IP addresses, and disk space usage.
- **Desktop & Remote Inspection**: Scan for installed desktop environments (XFCE, GNOME, KDE, Mate) and remote servers (TigerVNC, NoMachine, noVNC).
- **Service Monitoring**: Monitor the live statuses of common background daemons and service managers.
- **Automatic Installers/Uninstallers**: Quickly install or purge remote desktops and graphical environments with a single command.
- **Clean JSON Exports**: Export structured hardware/software data to standard JSON for integration with other orchestration APIs.

---

## Prerequisites

- **OS**: Linux (Ubuntu, Debian, CentOS, RHEL, Rocky Linux, Fedora, Alpine, Arch, Gentoo, NixOS, etc.)
- **Runtime**: [Node.js](https://nodejs.org) (v20+ recommended) or [Bun](https://bun.sh) (v1.0.0 or higher recommended)

---

## Installation & Development

### 1. Clone the repository and install dependencies

```bash
# Install dependencies
npm install
# or
bun install
```

### 2. Global Symlink (Run `smd` directly in terminal)

To register `smd` globally in your terminal shell path during development:

```bash
npm link
# or
bun link
```

Once linked, you can execute `smd` directly from any directory:
```bash
smd --help
```

### 3. Running in Development (without linking)

You can run the TypeScript CLI directly using Bun:

```bash
bun start --help
bun start detect
bun start status
bun start services
```

---

## CLI Reference

### `detect`
Inspect system distributions, package managers, virtualization, desktop setups, and hardware specs.
- `--json`: Format the full inspection results as JSON.
- `--no-cache`: Bypass hardware spec cache files.
```bash
smd detect --json
```

### `report`
Execute a full inspection scan and write system report files (`latest.json` & `latest.txt` + history files) to the `./reports` directory.
```bash
smd report
```

### `status`
Inspect quick resource utilization metrics (CPU load, RAM capacity, system uptime, and active host information).
```bash
smd status
```

### `services`
List the current status of all monitored system services.
```bash
smd services
```

### `update`
Refresh the package manager index cache registers.
```bash
smd update
```

### `install <target>`
Automate the installation of desktop environments or remote management tools.
Supported targets:
- `xfce`, `kde`, `gnome`, `mate`
- `tigervnc`, `nomachine`, `novnc`
```bash
# Example: Install XFCE desktop environment
smd install xfce

# Example: Install NoMachine
smd install nomachine
```

### `uninstall <target>`
Purge/remove a desktop environment or remote tool.
```bash
smd uninstall tigervnc
```

---

## Building & Compiling

SMD can be distributed as either a Node.js-compatible package or a standalone binary executable.

### 1. Build a Node.js Bundle
Bundles all TypeScript files into a single, dependency-free JavaScript file targeting Node.js using `esbuild`. This bundle begins with a Node shebang (`#!/usr/bin/env node`).

```bash
npm run build
# Outputs to: ./dist/smd.js
```
You can execute it using:
```bash
./dist/smd.js --help
```

### 2. Compile to a Host-Specific Binary
Compiles the application into a single executable binary that runs on the host OS without Node.js or Bun installed.

```bash
npm run compile
# Outputs to: ./bin/smd
```

### 3. Compile to a Standalone Linux Binary
Specifically compiles a standalone binary executable targeting Linux x64 architectures.

```bash
npm run compile:linux
# Outputs to: ./dist/smd-linux
```
You can run the binary directly:
```bash
./dist/smd-linux --help
```

---

## Publishing

There are two primary ways to publish and distribute this tool:

### Method A: Publish to NPM Registry

To make SMD installable via `npm install -g smd` or runnable via `npx smd`:

1. **Log in to NPM**:
   ```bash
   npm login
   ```
2. **Build and Publish**:
   The `prepublishOnly` lifecycle hook in `package.json` will automatically run `npm run build` before publishing.
   ```bash
   npm publish --access public
   ```
3. **Usage**:
   Once published, users can install it globally or run it instantly using:
   ```bash
   npm install -g smd
   smd detect
   # or
   npx smd detect
   ```

### Method B: Standalone Binary Release (GitHub Releases)

Ideal for distributing to headless servers that may not have Node.js or Bun installed:

1. **Compile the binary**:
   ```bash
   npm run compile:linux
   ```
2. **Create a GitHub Release**:
   - Upload the compiled executable binary (`./dist/smd-linux`) as an asset to your GitHub Release.
3. **Download and Run**:
   Users can install it with a simple curl script:
   ```bash
   sudo curl -L "https://github.com/<username>/smd/releases/latest/download/smd-linux" -o /usr/local/bin/smd
   sudo chmod +x /usr/local/bin/smd
   smd detect
   ```

---

## Recommended Setup Stacks

For setting up GUI/Remote capability on VPS or bare-metal servers:
- **Lightweight VPS**: `xfce` + `tigervnc` + `novnc`
- **High-Performance Remote**: `kde` + `nomachine`
- **Best Overall Balance**: `xfce` + `nomachine`

