# Fedora 41 Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker/container hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

# Common Fedora 41 Rules

- Target OS: Fedora 41.
- Package manager: `dnf`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
dnf info <package>
dnf repoquery --requires <package>
dnf search <term>
```
- Recommended install command style:
```bash
sudo dnf upgrade --refresh
sudo dnf install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
@server-product-environment
@headless-management
```

## Core Package Set

```text
acl
attr
audit
audit-libs
bind-utils
borgbackup
btrfs-progs
cifs-utils
cronie
dmidecode
docker
docker-compose
ethtool
fail2ban
firewalld
hdparm
httpd
iperf3
iproute
lm_sensors
logrotate
lshw
lvm2
mariadb-server
mdadm
mtr
nano
net-tools
nfs-utils
nginx
nmap
node_exporter
nvme-cli
openssh-server
pciutils
podman
postgresql-server
rclone
redis
restic
rsync
samba
screen
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

- GNOME Workstation: `@workstation-product-environment`
- KDE Plasma: `@kde-desktop-environment`
- XFCE: `@xfce-desktop-environment`
- Cinnamon: `@cinnamon-desktop-environment`
- MATE: `@mate-desktop-environment`
- LXQt: `@lxqt-desktop-environment`
- Server with GUI: `@graphical-server-environment`

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
sudo dnf upgrade --refresh
sudo dnf install <packages>
```
