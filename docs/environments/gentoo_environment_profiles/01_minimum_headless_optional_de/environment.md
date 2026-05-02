# Gentoo Linux Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical system for servers, containers, automation nodes, lab VMs, SBCs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg/Wayland session, no desktop apps unless a DE is explicitly selected.

# Common Gentoo Linux Rules

- Target OS: Gentoo Linux.
- Package manager: `portage/emerge`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
emerge --search <term>
equery depends <package>
```
- Recommended install command style:
```bash
sudo emerge --sync
sudo emerge --ask <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
system set plus openssh
```

## Core Package Set

```text
app-admin/sudo
net-misc/openssh
app-misc/ca-certificates
net-misc/curl
net-misc/wget
app-crypt/gnupg
app-editors/nano
app-editors/vim
sys-apps/less
sys-apps/man-db
app-shells/bash-completion
sys-apps/iproute2
net-misc/iputils
net-dns/bind-tools
net-analyzer/traceroute
net-firewall/nftables
net-firewall/ufw
net-misc/chrony
net-misc/rsync
app-arch/tar
app-arch/gzip
app-arch/xz-utils
app-arch/unzip
app-arch/zip
sys-apps/pciutils
sys-apps/usbutils
sys-apps/lshw
sys-apps/dmidecode
sys-apps/smartmontools
sys-process/htop
sys-fs/ncdu
sys-process/cronie
app-admin/logrotate
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `gnome gdm`
- KDE Plasma: `plasma-meta sddm`
- XFCE: `xfce4-meta lightdm`
- Cinnamon: `cinnamon lightdm`
- MATE: `mate lightdm`
- LXQt: `lxqt-meta sddm`
- Minimal Xorg baseline: `xorg-server xinit` plus chosen window manager

## Services / Daemons Expected

```text
ssh
systemd-timesyncd/chrony
cron/cronie
firewalld/ufw/nftables optional
```

## Exclusions / Guardrails

```text
Do not install multiple desktop environments unless explicitly requested.
Do not install GPU vendor drivers unless hardware or user selection requires it.
Do not enable server daemons on desktop profiles unless explicitly requested.
Use --no-install-recommends or distro equivalent for lean/headless profiles where appropriate.
Validate renamed, removed, EOL, or architecture-specific packages before automation.
```

## Example Install Pattern

```bash
sudo emerge --sync
sudo emerge --ask <packages>
```

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
