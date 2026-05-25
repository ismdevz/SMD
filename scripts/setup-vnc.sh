#!/usr/bin/env bash
# SMD — TigerVNC setup helper
set -euo pipefail

VNC_DIR="$HOME/.vnc"
mkdir -p "$VNC_DIR"

XSTARTUP_PATH="$VNC_DIR/xstartup"
echo "SMD: Configuring xstartup in $XSTARTUP_PATH..."

cat << 'EOF' > "$XSTARTUP_PATH"
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS

# Set up cursor and colors
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey

# Launch VNC Configuration utility
if [ -x /usr/bin/vncconfig ]; then
  /usr/bin/vncconfig -iconic &
fi

# Detect and execute desktop environments in order of lightweight to heavyweight
if [ -x /usr/bin/xfce4-session ]; then
  dbus-launch /usr/bin/xfce4-session
elif [ -x /usr/bin/mate-session ]; then
  dbus-launch /usr/bin/mate-session
elif [ -x /usr/bin/cinnamon-session ]; then
  dbus-launch /usr/bin/cinnamon-session
elif [ -x /usr/bin/startplasma-x11 ]; then
  dbus-launch /usr/bin/startplasma-x11
elif [ -x /usr/bin/gnome-session ]; then
  dbus-launch /usr/bin/gnome-session
else
  # Default fallback if no DE is found
  x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
  x-window-manager &
fi
EOF

chmod +x "$XSTARTUP_PATH"
echo "SMD: TigerVNC configuration complete."
