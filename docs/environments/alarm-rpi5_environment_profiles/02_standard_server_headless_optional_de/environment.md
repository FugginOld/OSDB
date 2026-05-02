# Arch Linux ARM Raspberry Pi 5 Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker/container hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

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
server services
```

## Core Package Set

```text
base
linux
linux-firmware
sudo
openssh
vim
nano
tmux
screen
rsync
borg
restic
rclone
logrotate
cronie
acl
attr
ufw
nftables
fail2ban
audit
apparmor
iproute2
net-tools
bind
tcpdump
nmap
mtr
ethtool
iperf3
lshw
dmidecode
pciutils
usbutils
smartmontools
nvme-cli
hdparm
lm_sensors
mdadm
lvm2
xfsprogs
btrfs-progs
nfs-utils
samba
cifs-utils
podman
docker
docker-compose
nginx
apache
mariadb
postgresql
redis
prometheus-node-exporter
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
networking service
firewall service
logging/cron
selected application services as installed
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
