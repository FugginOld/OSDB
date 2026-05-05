# Ubuntu 20.04 LTS Focal Standard Desktop Setup with Selectable DE

## Purpose

Balanced daily-driver desktop for browsing, office work, media, printing, scanning, remote access, and general productivity.

## Default Installation Mode

Desktop install. User selects exactly one DE.

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
ubuntu-desktop or selected flavor desktop metapackage
```

## Core Package Set

```text
alsa-utils
blueman
bluetooth
bluez
cups
curl
deja-dup
evince
file-roller
firefox
flatpak
fonts-dejavu
fonts-liberation
fonts-noto
fonts-noto-color-emoji
gimp
git
gparted
htop
inkscape
keepassxc
libreoffice
nano
ncdu
network-manager
network-manager-gnome
pavucontrol
pipewire
pipewire-media-session
printer-driver-all
rsync
sane-airscan
simple-scan
sudo
system-config-printer
thunderbird
timeshift
vim
vlc
wget
wireless-tools
wpasupplicant
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
