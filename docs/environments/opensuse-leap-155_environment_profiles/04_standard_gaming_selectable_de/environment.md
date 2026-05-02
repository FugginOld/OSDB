# openSUSE Leap 15.5 Standard Gaming Setup with Selectable DE

## Purpose

Gaming desktop profile for Steam, Proton/Wine, performance overlays, controllers, emulation, and GPU support.

## Default Installation Mode

Desktop install required. KDE Plasma or GNOME recommended; XFCE/LXQt acceptable for lighter systems.

# Common openSUSE Leap 15.5 Rules

- Target OS: openSUSE Leap 15.5.
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
selected desktop pattern plus gaming packages
```

## Core Package Set

```text
curl
dosbox
ffmpeg
gamemode
git
htop
joystick
lutris
mangohud
Mesa-demo-x
Mesa-vulkan-device-select
NetworkManager
nvidia-video-G06
nvtop
obs-studio
p7zip
pavucontrol
pipewire
retroarch
sensors
steam
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
