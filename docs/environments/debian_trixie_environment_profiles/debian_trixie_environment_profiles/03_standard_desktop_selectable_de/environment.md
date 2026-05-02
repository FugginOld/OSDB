# Debian Trixie Standard Desktop Setup with Selectable DE

## Purpose

Balanced daily-driver desktop for office, browsing, media, printing, scanning, remote access, and general productivity.

## Default Installation Mode

Desktop install. User selects exactly one DE.

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
task-desktop
one selected DE task
```

## Core Package Set

```text
sudo
network-manager
network-manager-gnome
wireless-tools
wpasupplicant
pipewire
pipewire-audio
wireplumber
pavucontrol
alsa-utils
bluetooth
bluez
blueman
cups
system-config-printer
printer-driver-all
sane-airscan
simple-scan
firefox-esr
thunderbird
libreoffice
evince
file-roller
gparted
vlc
celluloid
rhythmbox
shotwell
gimp
inkscape
keepassxc
seahorse
gnome-keyring
flatpak
gnome-software-plugin-flatpak
fonts-dejavu
fonts-liberation
fonts-noto
fonts-noto-color-emoji
timeshift
deja-dup
rsync
curl
wget
git
vim
nano
htop
ncdu
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
NetworkManager
PipeWire/WirePlumber
CUPS
Bluetooth optional
Flatpak optional
```

## Exclusions / Guardrails

```text
server database stacks by default
gaming stack by default
education/coding bulk unless selected
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
