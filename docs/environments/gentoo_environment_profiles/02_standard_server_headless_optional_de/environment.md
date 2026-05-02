# Gentoo Linux Standard Server Headless Install with Optional Selectable DE

## Purpose

General-purpose server baseline for NAS, Docker/container hosts, web services, databases, monitoring, and remote administration.

## Default Installation Mode

Headless server. GUI optional only for admin workstation use.

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
system set plus server services
```

## Core Package Set

```text
app-admin/sudo
net-misc/openssh
app-editors/vim
app-editors/nano
app-misc/tmux
app-misc/screen
net-misc/rsync
app-backup/borgbackup
app-backup/restic
net-misc/rclone
app-admin/logrotate
sys-process/cronie
sys-apps/acl
sys-apps/attr
net-firewall/nftables
net-firewall/ufw
app-admin/fail2ban
sys-process/audit
sys-apps/iproute2
net-analyzer/tcpdump
net-analyzer/nmap
net-analyzer/mtr
net-misc/iperf
sys-apps/smartmontools
sys-block/nvme-cli
sys-fs/lvm2
sys-fs/xfsprogs
sys-fs/btrfs-progs
net-fs/nfs-utils
net-fs/samba
app-containers/podman
app-containers/docker
www-servers/nginx
www-servers/apache
dev-db/mariadb
dev-db/postgresql
dev-db/redis
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
sudo emerge --sync
sudo emerge --ask <packages>
```

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
