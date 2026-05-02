# Debian Trixie Standard Gaming Setup with Selectable DE

## Purpose

Gaming desktop profile for Steam, Proton/Wine, performance overlays, controllers, emulation, and GPU support.

## Default Installation Mode

Desktop install required. KDE Plasma or GNOME recommended; XFCE/LXQt acceptable for lighter systems.

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
pipewire
pipewire-audio
wireplumber
pavucontrol
steam-installer
lutris
wine
winetricks
protontricks
gamemode
mangohud
vkbasalt
mesa-utils
vulkan-tools
mesa-vulkan-drivers
libgl1-mesa-dri
firmware-linux
firmware-linux-nonfree
firmware-amd-graphics
firmware-misc-nonfree
nvidia-driver
nvidia-settings
gamescope
obs-studio
ffmpeg
vlc
jstest-gtk
joystick
antimicrox
input-remapper
retroarch
pcsxr
dolphin-emu
dosbox
scummvm
p7zip-full
unzip
curl
wget
git
htop
nvtop
lm-sensors
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
gamemode
pipewire
bluetooth optional for controllers
steam runtime via steam-installer
```

## Exclusions / Guardrails

```text
Do not install NVIDIA packages on AMD/Intel-only systems unless detected/selected
education bulk
database servers
```

## Notes

- May require i386 architecture for Steam/Wine: `sudo dpkg --add-architecture i386 && sudo apt update`
- Enable contrib/non-free/non-free-firmware for Steam and proprietary firmware.

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
