#!/usr/bin/env bash
# SMD — MATE post-installation setup
set -euo pipefail

echo "SMD: Configuring MATE desktop environment..."
if [ -x "$(command -v dbus-uuidgen)" ]; then
    dbus-uuidgen --ensure || true
fi

echo "SMD: MATE desktop environment is ready."
