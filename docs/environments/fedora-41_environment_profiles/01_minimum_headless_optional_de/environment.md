# Fedora 41 Minimum Headless Install with Optional Selectable DE

## Purpose

Smallest practical system for servers, containers, automation nodes, lab VMs, SBCs, or base images.

## Default Installation Mode

Headless. No display manager, no Xorg/Wayland session, no desktop apps unless a DE is explicitly selected.

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
@core
openssh-server
```

## Core Package Set

```text
bash-completion
bind-utils
ca-certificates
chrony
cronie
curl
dmidecode
firewalld
gnupg2
gzip
htop
iproute
iputils
less
logrotate
lshw
man-db
nano
ncdu
nftables
openssh-server
pciutils
rsync
smartmontools
sudo
tar
traceroute
unzip
usbutils
vim-minimal
wget
xz
zip
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
sudo dnf upgrade --refresh
sudo dnf install <packages>
```
