#!/usr/bin/env bash
# SMD — KDE post-installation setup
set -euo pipefail

echo "SMD: Configuring KDE Plasma desktop environment..."
if [ -x "$(command -v dbus-uuidgen)" ]; then
    dbus-uuidgen --ensure || true
fi

# Set default boot target to GUI if systemd is available
if [ -d /run/systemd/system ] && [ -x "$(command -v systemctl)" ]; then
    echo "SMD: Setting systemd target to graphical..."
    systemctl set-default graphical.target || true
fi

echo "SMD: KDE Plasma desktop environment is ready."
