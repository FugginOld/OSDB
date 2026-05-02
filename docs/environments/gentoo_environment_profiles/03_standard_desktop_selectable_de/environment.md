# Gentoo Linux Standard Desktop Setup with Selectable DE

## Purpose

Balanced daily-driver desktop for browsing, office work, media, printing, scanning, remote access, and general productivity.

## Default Installation Mode

Desktop install. User selects exactly one DE.

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
selected desktop profile/packages
```

## Core Package Set

```text
net-misc/networkmanager
media-video/pipewire
gui-apps/wireplumber
media-sound/pavucontrol
media-sound/alsa-utils
net-wireless/bluez
net-print/cups
media-gfx/simple-scan
www-client/firefox
mail-client/thunderbird
app-office/libreoffice
app-arch/file-roller
sys-block/gparted
media-video/vlc
media-gfx/gimp
media-gfx/inkscape
app-admin/keepassxc
sys-apps/flatpak
media-fonts/dejavu
media-fonts/liberation-fonts
media-fonts/noto-emoji
net-misc/rsync
net-misc/curl
net-misc/wget
dev-vcs/git
app-editors/vim
app-editors/nano
sys-process/htop
sys-fs/ncdu
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
