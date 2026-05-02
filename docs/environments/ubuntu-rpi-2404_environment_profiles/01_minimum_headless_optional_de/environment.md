# Ubuntu Server/Desktop for Raspberry Pi 24.04 LTS Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical system for servers, containers, automation nodes, lab VMs, SBCs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg/Wayland session, no desktop apps unless a DE is explicitly selected.

# Common Ubuntu Server/Desktop for Raspberry Pi 24.04 LTS Rules

- Target OS: Ubuntu Server/Desktop for Raspberry Pi 24.04 LTS.
- Package manager: `apt`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
apt-cache policy <package>
apt-cache depends <package>
apt-cache search <term>
```
- Recommended install command style:
```bash
sudo apt update
sudo apt install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
openssh-server
```

## Core Package Set

```text
apt-transport-https
bash-completion
ca-certificates
cron
curl
dmidecode
dnsutils
gnupg
gzip
htop
iproute2
iputils-ping
less
locales
logrotate
lsb-release
lshw
man-db
nano
ncdu
net-tools
nftables
openssh-server
pciutils
rsync
smartmontools
sudo
systemd-timesyncd
tar
traceroute
tzdata
ufw
unzip
usbutils
vim-tiny
wget
xz-utils
zip
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `task-gnome-desktop` / `ubuntu-desktop`
- KDE Plasma: `task-kde-desktop` / `kubuntu-desktop`
- XFCE: `task-xfce-desktop` / `xubuntu-desktop`
- Cinnamon: `task-cinnamon-desktop` / `ubuntucinnamon-desktop`
- MATE: `task-mate-desktop` / `ubuntu-mate-desktop`
- LXQt/Lubuntu: `task-lxqt-desktop` / `lubuntu-desktop`
- LXDE: `task-lxde-desktop` where available

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
sudo apt update
sudo apt install <packages>
```
