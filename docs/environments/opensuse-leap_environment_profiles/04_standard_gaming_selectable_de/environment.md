# openSUSE Leap Standard Gaming Setup with Selectable DE

## Purpose

Gaming desktop profile for Steam, Proton/Wine, performance overlays, controllers, emulation, and GPU support.

## Default Installation Mode

Desktop install required. KDE Plasma or GNOME recommended; XFCE/LXQt acceptable for lighter systems.

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
selected desktop pattern plus gaming packages
```

## Core Package Set

```text
sudo
NetworkManager
pipewire
wireplumber
pavucontrol
steam
lutris
wine
winetricks
gamemode
mangohud
Mesa-demo-x
vulkan-tools
Mesa-vulkan-device-select
nvidia-video-G06
obs-studio
ffmpeg
vlc
joystick
retroarch
dosbox
p7zip
unzip
curl
wget
git
htop
nvtop
sensors
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

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
