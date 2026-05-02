# Arch Linux ARM Raspberry Pi 4 Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical system for servers, containers, automation nodes, lab VMs, SBCs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg/Wayland session, no desktop apps unless a DE is explicitly selected.

# Common Arch Linux ARM Raspberry Pi 4 Rules

- Target OS: Arch Linux ARM Raspberry Pi 4.
- Package manager: `pacman`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
pacman -Si <package>
pactree <package>
pacman -Ss <term>
```
- Recommended install command style:
```bash
sudo pacman -Syu
sudo pacman -S <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
base
linux or platform kernel
openssh
```

## Core Package Set

```text
base
linux
linux-firmware
sudo
openssh
ca-certificates
curl
wget
gnupg
nano
vim
less
man-db
man-pages
bash-completion
net-tools
iproute2
iputils
bind
traceroute
nftables
ufw
systemd-timesyncd
rsync
tar
gzip
xz
unzip
zip
pciutils
usbutils
lshw
dmidecode
smartmontools
htop
ncdu
cronie
logrotate
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `gnome gdm`
- KDE Plasma: `plasma kde-applications sddm`
- XFCE: `xfce4 xfce4-goodies lightdm lightdm-gtk-greeter`
- Cinnamon: `cinnamon lightdm lightdm-gtk-greeter`
- MATE: `mate mate-extra lightdm lightdm-gtk-greeter`
- LXQt: `lxqt sddm`
- Minimal Xorg baseline: `xorg-server xorg-xinit` plus chosen window manager

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
sudo pacman -Syu
sudo pacman -S <packages>
```

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
