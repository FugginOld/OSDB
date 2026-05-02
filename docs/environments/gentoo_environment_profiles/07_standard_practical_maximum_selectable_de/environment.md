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
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
selected desktop, server, developer, and admin packages
```

## Core Package Set

```text
app-admin/ansible
app-admin/fail2ban
app-admin/keepassxc
app-admin/logrotate
app-admin/sudo
app-arch/file-roller
app-arch/gzip
app-arch/p7zip
app-arch/tar
app-arch/unzip
app-arch/xz-utils
app-arch/zip
app-backup/borgbackup
app-backup/restic
app-containers/docker
app-containers/docker-compose
app-containers/podman
app-crypt/gnupg
app-editors/emacs
app-editors/nano
app-editors/neovim
app-editors/vim
app-emulation/wine-vanilla
app-emulation/winetricks
app-misc/ca-certificates
app-misc/jq
app-misc/screen
app-misc/tmux
app-office/libreoffice
app-office/scribus
app-shells/bash-completion
app-shells/fzf
app-shells/shellcheck
app-text/pandoc
dev-db/mariadb
dev-db/postgresql
dev-db/redis
dev-db/sqlite
dev-java/gradle-bin
dev-java/maven-bin
dev-lang/go
dev-lang/nodejs
dev-lang/perl
dev-lang/php
dev-lang/python
dev-lang/ruby
dev-lang/rust-bin
dev-php/composer
dev-python/pip
dev-python/virtualenv
dev-util/cmake
dev-util/meson
dev-util/ninja
dev-util/vulkan-tools
dev-vcs/git
dev-vcs/git-lfs
games-emulation/dosbox
games-emulation/retroarch
games-kids/gcompris-qt
games-util/gamemode
games-util/lutris
games-util/mangohud
games-util/steam-launcher
gui-apps/wireplumber
mail-client/thunderbird
media-fonts/dejavu
media-fonts/liberation-fonts
media-fonts/noto
media-fonts/noto-emoji
media-gfx/gimp
media-gfx/inkscape
media-gfx/krita
media-gfx/simple-scan
media-libs/mesa
media-sound/alsa-utils
media-sound/audacity
media-sound/pavucontrol
media-video/ffmpeg
media-video/obs-studio
media-video/pipewire
media-video/vlc
net-analyzer/mtr
net-analyzer/nmap
net-analyzer/tcpdump
net-analyzer/traceroute
net-dns/bind-tools
net-firewall/nftables
net-firewall/ufw
net-fs/nfs-utils
net-fs/samba
net-misc/chrony
net-misc/curl
net-misc/iperf
net-misc/iputils
net-misc/networkmanager
net-misc/openssh
net-misc/rclone
net-misc/rsync
net-misc/wget
net-print/cups
net-wireless/bluez
sci-astronomy/stellarium
sys-apps/acl
sys-apps/attr
sys-apps/dmidecode
sys-apps/flatpak
sys-apps/iproute2
sys-apps/less
sys-apps/lm-sensors
sys-apps/lshw
sys-apps/man-db
sys-apps/pciutils
sys-apps/ripgrep
sys-apps/smartmontools
sys-apps/usbutils
sys-block/gparted
sys-block/nvme-cli
sys-devel/gcc
sys-devel/gdb
sys-fs/btrfs-progs
sys-fs/lvm2
sys-fs/ncdu
sys-fs/xfsprogs
sys-process/audit
sys-process/cronie
sys-process/htop
virtual/jdk
www-client/firefox
www-servers/apache
www-servers/nginx
x11-drivers/nvidia-drivers
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
