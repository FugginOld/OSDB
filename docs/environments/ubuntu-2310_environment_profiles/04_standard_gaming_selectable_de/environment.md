# Ubuntu 23.10 Mantic Standard Gaming Setup with Selectable DE

## Purpose

Gaming desktop profile for Steam, Proton/Wine, performance overlays, controllers, emulation, and GPU support.

## Default Installation Mode

Desktop install required. KDE Plasma or GNOME recommended; XFCE/LXQt acceptable for lighter systems.

# Common Ubuntu 23.10 Mantic Rules

- Target OS: Ubuntu 23.10 Mantic.
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
selected flavor desktop metapackage plus gaming packages
```

## Core Package Set

```text
curl
dosbox
ffmpeg
firmware-amd-graphics
firmware-linux
firmware-linux-nonfree
firmware-misc-nonfree
gamemode
git
htop
joystick
lm-sensors
lutris
mangohud
mesa-utils
mesa-vulkan-drivers
network-manager
nvidia-driver
nvidia-settings
nvtop
obs-studio
p7zip-full
pavucontrol
pipewire
retroarch
steam-installer
sudo
unzip
vlc
vulkan-tools
wget
wine
winetricks
wireplumber
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
