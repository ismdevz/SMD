#!/usr/bin/env bash
# SMD — Pre-requisites and dependencies installer
set -euo pipefail

echo "SMD: Installing system pre-requisite dependencies..."

# Detect Package Manager
if [ -x "$(command -v apt-get)" ]; then
    apt-get update
    apt-get install -y wget curl pciutils dbus-x11 xauth xinit sudo
elif [ -x "$(command -v dnf)" ]; then
    dnf install -y wget curl pciutils dbus-x11 xauth xinit sudo
elif [ -x "$(command -v yum)" ]; then
    yum install -y wget curl pciutils dbus-x11 xauth xinit sudo
elif [ -x "$(command -v pacman)" ]; then
    pacman -Sy --noconfirm wget curl pciutils dbus-x11 xorg-xauth xorg-xinit sudo
elif [ -x "$(command -v apk)" ]; then
    apk update
    apk add wget curl pciutils dbus xauth xinit sudo bash
elif [ -x "$(command -v zypper)" ]; then
    zypper refresh
    zypper install -y wget curl pciutils dbus-1 xauth xinit sudo
else
    echo "Warning: No supported package manager found. Skipping installation."
    exit 1
fi

echo "SMD: System dependencies installed successfully."
