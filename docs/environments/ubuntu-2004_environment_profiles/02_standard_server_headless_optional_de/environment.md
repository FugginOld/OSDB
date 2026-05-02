# Ubuntu 20.04 LTS Focal Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker/container hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

# Common Ubuntu 20.04 LTS Focal Rules

- Target OS: Ubuntu 20.04 LTS Focal.
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
ubuntu-server
openssh-server
```

## Core Package Set

```text
acl
apache2
apparmor
apparmor-utils
attr
auditd
bash-completion
borgbackup
btrfs-progs
ca-certificates
cifs-utils
cron
curl
dmidecode
dnsutils
docker-compose
docker.io
ethtool
fail2ban
gnupg
hdparm
iperf3
iproute2
lm-sensors
logrotate
lsb-release
lshw
lvm2
mariadb-server
mdadm
mtr-tiny
nano
net-tools
nfs-common
nftables
nginx
nmap
nvme-cli
openssh-server
pciutils
podman
postgresql
prometheus-node-exporter
rclone
redis-server
restic
rsync
samba
screen
smartmontools
sudo
tcpdump
tmux
ufw
usbutils
vim
wget
xfsprogs
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
sudo apt update
sudo apt install <packages>
```
