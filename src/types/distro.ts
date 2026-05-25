export interface DistroInfo {
  id: string; // e.g. "debian", "ubuntu", "arch", "fedora", "alpine", "opensuse"
  name: string; // e.g. "Debian GNU/Linux"
  version: string; // e.g. "12", "22.04"
  codename?: string; // e.g. "bookworm"
}
