#!/usr/bin/env bash
# SMD — TigerVNC + Xorg dynamic setup for headless VPS
# Detects installed desktop environments, configures Xorg virtual displays,
# and generates the appropriate xstartup without requiring LightDM.
set -euo pipefail

VNC_DIR="$HOME/.vnc"
mkdir -p "$VNC_DIR"

# ──────────────────────────────────────────────
# Step 1: Detect installed desktop environment
# ──────────────────────────────────────────────
detect_de() {
  # Check in order of specificity (lightest first)
  if [ -x /usr/bin/xfce4-session ] || [ -x /usr/bin/startxfce4 ]; then
    echo "xfce"
  elif [ -x /usr/bin/mate-session ]; then
    echo "mate"
  elif [ -x /usr/bin/cinnamon-session ] || [ -x /usr/bin/cinnamon ]; then
    echo "cinnamon"
  elif [ -x /usr/bin/gnome-shell ]; then
    echo "gnome"
  elif [ -x /usr/bin/plasmashell ] || [ -x /usr/bin/startplasma-x11 ] || [ -x /usr/bin/startkde ]; then
    echo "kde"
  else
    # Fallback: check xsessions directory
    for f in /usr/share/xsessions/*.desktop; do
      [ -f "$f" ] || continue
      local name
      name=$(basename "$f" .desktop)
      case "$name" in
        xfce|xfce4)     echo "xfce"; return ;;
        mate)           echo "mate"; return ;;
        cinnamon|cinnamon2d) echo "cinnamon"; return ;;
        gnome|gnome-xorg) echo "gnome"; return ;;
        plasma|plasma-x11) echo "kde"; return ;;
      esac
    done
    echo "none"
  fi
}

DETECTED_DE=$(detect_de)
echo "SMD: Detected desktop environment: ${DETECTED_DE}"

# ──────────────────────────────────────────────
# Step 2: Configure Xorg for headless operation
# ──────────────────────────────────────────────
# Create a minimal xorg.conf for virtual displays if missing
XORG_CONF="/etc/X11/xorg.conf"
if [ ! -f "$XORG_CONF" ] && [ ! -f /etc/X11/xorg.conf.d/ ]; then
  echo "SMD: Creating minimal Xorg configuration for headless VPS..."
  mkdir -p /etc/X11/xorg.conf.d 2>/dev/null || true
  cat << 'XEOF' > /tmp/xorg-headless.conf
# Minimal Xorg configuration for headless VPS (no physical display)
# This allows virtual displays for VNC/NoMachine to work correctly
Section "Device"
  Identifier  "VirtualDevice"
  Driver      "modesetting"
  Option      "SWCursor"  "true"
EndSection

Section "Monitor"
  Identifier  "VirtualMonitor"
  Option      "DPMS" "false"
EndSection

Section "Screen"
  Identifier  "VirtualScreen"
  Device      "VirtualDevice"
  Monitor     "VirtualMonitor"
  DefaultDepth 24
  SubSection  "Display"
    Depth    24
    Modes    "1920x1080" "1280x720" "1024x768"
  EndSubSection
EndSection
XEOF
  # Only install if we have sudo
  if command -v sudo &>/dev/null; then
    sudo cp /tmp/xorg-headless.conf /etc/X11/xorg.conf.d/99-headless.conf 2>/dev/null || true
  fi
  rm -f /tmp/xorg-headless.conf
fi

# ──────────────────────────────────────────────
# Step 3: Configure dbus for session management
# ──────────────────────────────────────────────
if [ -x "$(command -v dbus-uuidgen)" ]; then
  dbus-uuidgen --ensure 2>/dev/null || true
fi

# ──────────────────────────────────────────────
# Step 4: Generate dynamic xstartup
# ──────────────────────────────────────────────
XSTARTUP_PATH="$VNC_DIR/xstartup"

# Map DE names to their session start commands
get_de_cmd() {
  case "$1" in
    xfce)     echo "/usr/bin/startxfce4" ;;
    mate)     echo "/usr/bin/mate-session" ;;
    cinnamon) echo "/usr/bin/cinnamon-session" ;;
    gnome)    echo "/usr/bin/gnome-session" ;;
    kde)      echo "/usr/bin/startplasma-x11" ;;
    *)        echo "" ;;
  esac
}

DE_CMD=$(get_de_cmd "$DETECTED_DE")

echo "SMD: Generating xstartup..."
cat << 'XSTARTUP' > "$XSTARTUP_PATH"
#!/bin/sh
# SMD Dynamic VNC xstartup — Auto-generated for headless VPS
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS

# Load X resources if present
[ -r "$HOME/.Xresources" ] && xrdb "$HOME/.Xresources"
xsetroot -solid grey -cursor_name left_ptr

# Start VNC config utility in background
if [ -x /usr/bin/vncconfig ]; then
  /usr/bin/vncconfig -iconic &
fi

# Start a simple window manager fallback first
if [ -x /usr/bin/xset ]; then
  xset s off       # Disable screen saver
  xset -dpms       # Disable DPMS (power saving)
  xset s noblank   # No blanking
fi

# Desktop Environment launch — detected at install time
XSTARTUP

if [ -n "$DE_CMD" ]; then
  cat << XEOF >> "$XSTARTUP_PATH"
# Launch ${DETECTED_DE} desktop environment
if [ -x ${DE_CMD} ]; then
  # Use dbus-launch for proper session bus
  export XDG_SESSION_TYPE=x11
  export XDG_CURRENT_DESKTOP=$(echo "${DETECTED_DE}" | tr '[:lower:]' '[:upper:]' | head -c1)$(echo "${DETECTED_DE}" | cut -c2-)
  dbus-launch --exit-with-session ${DE_CMD}
else
  # Fallback to xterm + x-window-manager
  x-terminal-emulator -geometry 80x24+10+10 -ls -title "Desktop" &
  x-window-manager &
fi
XEOF
else
  # No DE detected — generic fallback
  cat << 'XEOF' >> "$XSTARTUP_PATH"
# No desktop environment detected — fallback to basic X session
x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
x-window-manager &
XEOF
fi

chmod +x "$XSTARTUP_PATH"
echo "SMD: TigerVNC xstartup generated at ${XSTARTUP_PATH}"
echo "SMD: Using desktop environment: ${DETECTED_DE}"

# ──────────────────────────────────────────────
# Step 5: Ensure Xvnc works without LightDM
# ──────────────────────────────────────────────
# TigerVNC's Xvnc IS the X server — no LightDM needed.
# This script ensures the environment is ready.

# Set DISPLAY if not set (vncserver manages this normally)
export DISPLAY="${DISPLAY:-:1}"

echo "SMD: Setup complete. Run 'vncserver :1 -geometry 1920x1080 -depth 24' to start."
echo "SMD: Note: No LightDM required — Xvnc acts as both X server and VNC server."
