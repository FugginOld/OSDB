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
app-admin/keepassxc
app-arch/file-roller
app-editors/nano
app-editors/vim
app-office/libreoffice
dev-vcs/git
gui-apps/wireplumber
mail-client/thunderbird
media-fonts/dejavu
media-fonts/liberation-fonts
media-fonts/noto-emoji
media-gfx/gimp
media-gfx/inkscape
media-gfx/simple-scan
media-sound/alsa-utils
media-sound/pavucontrol
media-video/pipewire
media-video/vlc
net-misc/curl
net-misc/networkmanager
net-misc/rsync
net-misc/wget
net-print/cups
net-wireless/bluez
sys-apps/flatpak
sys-block/gparted
sys-fs/ncdu
sys-process/htop
www-client/firefox
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
