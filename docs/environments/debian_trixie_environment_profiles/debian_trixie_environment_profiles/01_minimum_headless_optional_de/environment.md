# Debian Trixie Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical Debian system for servers, containers, automation nodes, lab VMs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg, no Wayland, no desktop apps.

# Common Debian Trixie Rules

- Target OS: Debian 13 “Trixie”.
- Package manager: `apt`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use Debian repository packages first.
- Enable `contrib`, `non-free`, and `non-free-firmware` only when firmware, Steam, or proprietary hardware support is required.
- Validate package availability before building automation:
  - `apt-cache policy <package>`
  - `apt-cache depends <package>`
  - `apt-cache search <term>`
- Recommended install command style:
  - `sudo apt update`
  - `sudo apt install --no-install-recommends <packages>` for lean installs
  - `sudo apt install <packages>` for standard installs
- Avoid installing every package in Debian. “Full install” here means practical profile maximum, not the full Debian archive.


## Debian Task Packages

```text
task-ssh-server
```

## Core Package Set

```text
sudo
openssh-server
ca-certificates
apt-transport-https
curl
wget
gnupg
lsb-release
locales
tzdata
nano
vim-tiny
less
man-db
bash-completion
net-tools
iproute2
iputils-ping
dnsutils
traceroute
nftables
ufw
systemd-timesyncd
rsync
tar
gzip
xz-utils
unzip
zip
pciutils
usbutils
lshw
dmidecode
smartmontools
htop
ncdu
cron
logrotate
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `task-gnome-desktop`
- KDE Plasma: `task-kde-desktop`
- XFCE: `task-xfce-desktop`
- Cinnamon: `task-cinnamon-desktop`
- MATE: `task-mate-desktop`
- LXQt: `task-lxqt-desktop`
- LXDE: `task-lxde-desktop`

For a generic Debian desktop baseline, pair the chosen DE with `task-desktop` unless the chosen task already pulls the expected desktop stack.


## Services / Daemons Expected

```text
ssh
systemd-timesyncd
cron
nftables/ufw optional
```

## Exclusions / Guardrails

```text
task-desktop
display-manager
xorg
libreoffice
cups
avahi-daemon
bluetooth
games
```

## Example Install Pattern

Headless/default profile:

```bash
sudo apt update
sudo apt install <packages-from-this-file>
```

Optional DE:

```bash
sudo apt update
sudo apt install task-desktop <selected-desktop-task>
```

## LLM Build Instructions

When using this file to generate code, scripts, Ansible roles, Dockerfiles, or installers:

1. Treat task packages and package names as Debian Trixie `apt` targets.
2. Validate package availability before finalizing automation.
3. Keep desktop environment selection as a variable.
4. Do not install multiple DE tasks unless the user explicitly requests multi-DE testing.
5. Prefer idempotent scripts.
6. Separate base/headless packages from optional GUI packages.
7. Add hardware-specific packages only when detected or selected.
