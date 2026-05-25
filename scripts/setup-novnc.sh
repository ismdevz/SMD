#!/usr/bin/env bash
# SMD — noVNC setup and service configuration
set -euo pipefail

echo "SMD: Configuring noVNC proxy service..."

NOVNC_PATH="/usr/share/novnc"
if [ ! -d "$NOVNC_PATH" ] && [ -d "/opt/novnc" ]; then
    NOVNC_PATH="/opt/novnc"
fi

if [ ! -d "$NOVNC_PATH" ]; then
    echo "Error: noVNC installation folder not found in /usr/share/novnc or /opt/novnc."
    exit 1
fi

WEBSOCKIFY_BIN=""
if [ -x "$(command -v websockify)" ]; then
    WEBSOCKIFY_BIN="$(command -v websockify)"
fi

if [ -z "$WEBSOCKIFY_BIN" ]; then
    echo "Error: websockify command is not installed or not in PATH."
    exit 1
fi

# Detect Systemd
if [ -d /run/systemd/system ]; then
    SERVICE_FILE="/etc/systemd/system/novnc.service"
    echo "SMD: Creating systemd service file at ${SERVICE_FILE}..."

    cat << EOF > "${SERVICE_FILE}"
[Unit]
Description=noVNC HTML5 VNC Proxy
After=network.target

[Service]
Type=simple
ExecStart=${WEBSOCKIFY_BIN} --web ${NOVNC_PATH} 6080 localhost:5901
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable novnc.service || true
    echo "SMD: noVNC systemd service created and enabled."
else
    echo "SMD: Non-systemd environment. Starting noVNC proxy manually using: "
    echo "  ${WEBSOCKIFY_BIN} --web ${NOVNC_PATH} 6080 localhost:5901 &"
fi
