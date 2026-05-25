#!/usr/bin/env bash
# SMD — XFCE post-installation setup
set -euo pipefail

echo "SMD: Configuring XFCE desktop environment..."
# Check for dbus installation to prevent GUI errors
if [ -x "$(command -v dbus-uuidgen)" ]; then
    dbus-uuidgen --ensure || true
fi

echo "SMD: XFCE desktop environment is ready."
