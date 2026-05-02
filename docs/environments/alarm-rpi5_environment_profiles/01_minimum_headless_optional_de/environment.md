# Arch Linux ARM Raspberry Pi 5 Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical system for servers, containers, automation nodes, lab VMs, SBCs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg/Wayland session, no desktop apps unless a DE is explicitly selected.

# Common Arch Linux ARM Raspberry Pi 5 Rules

- Target OS: Arch Linux ARM Raspberry Pi 5.
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
bash-completion
bind
ca-certificates
cronie
curl
dmidecode
gnupg
gzip
htop
iproute2
iputils
less
linux
linux-firmware
logrotate
lshw
man-db
man-pages
nano
ncdu
net-tools
nftables
openssh
pciutils
rsync
smartmontools
sudo
systemd-timesyncd
tar
traceroute
ufw
unzip
usbutils
vim
wget
xz
zip
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
