#!/usr/bin/env bash
# SMD — Cleanup scripts and logs
set -euo pipefail

echo "SMD: Cleaning up temp installation files..."

# Remove temporary downloaded packages
rm -f /tmp/nomachine_*.deb
rm -f /tmp/nomachine_*.rpm

# Clean package manager caches
if [ -x "$(command -v apt-get)" ]; then
    apt-get clean
elif [ -x "$(command -v dnf)" ]; then
    dnf clean all
elif [ -x "$(command -v yum)" ]; then
    yum clean all
elif [ -x "$(command -v pacman)" ]; then
    pacman -Scc --noconfirm
elif [ -x "$(command -v apk)" ]; then
    rm -rf /var/cache/apk/*
fi

echo "SMD: System cleanup complete."
