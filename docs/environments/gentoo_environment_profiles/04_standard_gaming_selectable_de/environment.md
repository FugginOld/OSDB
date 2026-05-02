# Gentoo Linux Standard Gaming Setup with Selectable DE

## Purpose

Gaming desktop profile for Steam, Proton/Wine, performance overlays, controllers, emulation, and GPU support.

## Default Installation Mode

Desktop install required. KDE Plasma or GNOME recommended; XFCE/LXQt acceptable for lighter systems.

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
selected desktop profile plus gaming packages
```

## Core Package Set

```text
net-misc/networkmanager
media-video/pipewire
gui-apps/wireplumber
media-sound/pavucontrol
games-util/steam-launcher
games-util/lutris
app-emulation/wine-vanilla
app-emulation/winetricks
games-util/gamemode
games-util/mangohud
media-libs/mesa
dev-util/vulkan-tools
x11-drivers/nvidia-drivers
media-video/obs-studio
media-video/ffmpeg
media-video/vlc
games-emulation/retroarch
games-emulation/dosbox
app-arch/p7zip
app-arch/unzip
net-misc/curl
net-misc/wget
dev-vcs/git
sys-process/htop
sys-apps/lm-sensors
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
