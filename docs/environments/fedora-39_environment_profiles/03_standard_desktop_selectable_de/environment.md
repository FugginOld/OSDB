# Fedora 39 Standard Desktop Setup with Selectable DE

## Purpose

Balanced daily-driver desktop for browsing, office work, media, printing, scanning, remote access, and general productivity.

## Default Installation Mode

Desktop install. User selects exactly one DE.

# Common Fedora 39 Rules

- Target OS: Fedora 39.
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
@workstation-product-environment or selected desktop environment group
```

## Core Package Set

```text
alsa-utils
blueman
bluez
cups
curl
dejavu-sans-fonts
evince
file-roller
firefox
flatpak
gimp
git
google-noto-emoji-fonts
gparted
htop
inkscape
keepassxc
liberation-fonts
libreoffice
nano
ncdu
NetworkManager
pavucontrol
pipewire
rsync
sane-airscan
sane-backends
simple-scan
sudo
system-config-printer
thunderbird
vim
vlc
wget
wireplumber
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
