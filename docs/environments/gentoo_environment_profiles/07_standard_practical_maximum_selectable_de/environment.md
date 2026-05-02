# Gentoo Linux Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

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
- Avoid installing every package in the archive. â€œPractical maximumâ€ means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
selected desktop, server, developer, and admin packages
```

## Core Package Set

```text
app-admin/sudo
net-misc/openssh
app-misc/ca-certificates
net-misc/curl
net-misc/wget
app-crypt/gnupg
app-editors/nano
app-editors/vim
sys-apps/less
sys-apps/man-db
app-shells/bash-completion
sys-apps/iproute2
net-misc/iputils
net-dns/bind-tools
net-analyzer/traceroute
net-firewall/nftables
net-firewall/ufw
net-misc/chrony
net-misc/rsync
app-arch/tar
app-arch/gzip
app-arch/xz-utils
app-arch/unzip
app-arch/zip
sys-apps/pciutils
sys-apps/usbutils
sys-apps/lshw
sys-apps/dmidecode
sys-apps/smartmontools
sys-process/htop
sys-fs/ncdu
sys-process/cronie
app-admin/logrotate
app-misc/tmux
app-misc/screen
app-backup/borgbackup
app-backup/restic
net-misc/rclone
sys-apps/acl
sys-apps/attr
app-admin/fail2ban
sys-process/audit
net-analyzer/tcpdump
net-analyzer/nmap
net-analyzer/mtr
net-misc/iperf
sys-block/nvme-cli
sys-fs/lvm2
sys-fs/xfsprogs
sys-fs/btrfs-progs
net-fs/nfs-utils
net-fs/samba
app-containers/podman
app-containers/docker
www-servers/nginx
www-servers/apache
dev-db/mariadb
dev-db/postgresql
dev-db/redis
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
dev-vcs/git
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
games-emulation/retroarch
games-emulation/dosbox
app-arch/p7zip
sys-apps/lm-sensors
media-gfx/krita
app-office/scribus
sci-astronomy/stellarium
games-kids/gcompris-qt
dev-lang/python
dev-python/pip
media-sound/audacity
media-fonts/noto
sys-devel/gcc
sys-devel/gdb
dev-util/cmake
dev-util/meson
dev-util/ninja
dev-vcs/git-lfs
dev-python/virtualenv
dev-lang/nodejs
dev-lang/go
dev-lang/rust-bin
virtual/jdk
dev-java/maven-bin
dev-java/gradle-bin
dev-lang/php
dev-php/composer
dev-lang/ruby
dev-lang/perl
dev-db/sqlite
app-containers/docker-compose
app-admin/ansible
app-shells/shellcheck
app-misc/jq
app-editors/neovim
app-editors/emacs
sys-apps/ripgrep
app-shells/fzf
app-text/pandoc
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
