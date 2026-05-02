# Debian Trixie Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

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
task-standard
task-ssh-server
```

## Core Package Set

```text
sudo
openssh-server
ca-certificates
curl
wget
gnupg
lsb-release
vim
nano
tmux
screen
bash-completion
command-not-found
rsync
borgbackup
restic
rclone
logrotate
cron
acl
attr
ufw
nftables
fail2ban
auditd
apparmor
apparmor-utils
iproute2
net-tools
dnsutils
bind9-dnsutils
tcpdump
nmap
mtr-tiny
ethtool
iperf3
lshw
dmidecode
pciutils
usbutils
smartmontools
nvme-cli
hdparm
lm-sensors
mdadm
lvm2
xfsprogs
btrfs-progs
nfs-common
samba
cifs-utils
podman
docker.io
docker-compose
compose-switch
nginx
apache2
mariadb-server
postgresql
redis-server
prometheus-node-exporter
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
fail2ban
auditd
apparmor
cron
logrotate
docker or podman
prometheus-node-exporter optional
```

## Exclusions / Guardrails

```text
task-desktop by default
games
large office suites unless needed
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
