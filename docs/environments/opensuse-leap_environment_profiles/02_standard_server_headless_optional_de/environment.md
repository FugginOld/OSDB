# openSUSE Leap Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker/container hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

# Common openSUSE Leap Rules

- Target OS: openSUSE Leap.
- Package manager: `zypper`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
zypper info <package>
zypper search <term>
```
- Recommended install command style:
```bash
sudo zypper refresh
sudo zypper install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
patterns-server-file_server or selected server patterns
```

## Core Package Set

```text
acl
apache2
apparmor-utils
attr
audit
bind-utils
borgbackup
btrfsprogs
cifs-utils
cron
dmidecode
docker
docker-compose
ethtool
fail2ban
firewalld
hdparm
iperf
iproute2
logrotate
lshw
lvm2
mariadb
mdadm
mtr
nano
net-tools
nfs-client
nginx
nmap
nvme-cli
openssh
pciutils
podman
postgresql-server
prometheus-node_exporter
rclone
redis
restic
rsync
samba-client
screen
sensors
smartmontools
sudo
tcpdump
tmux
usbutils
vim
xfsprogs
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `patterns-gnome-gnome`
- KDE Plasma: `patterns-kde-kde_plasma`
- XFCE: `patterns-xfce-xfce`
- LXQt: `patterns-lxqt-lxqt`
- MATE: `patterns-mate-mate`
- IceWM minimal GUI: `icewm xorg-x11-server`
- Generic desktop base: `patterns-base-x11`

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
sudo zypper refresh
sudo zypper install <packages>
```
