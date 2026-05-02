# Arch Linux ARM Raspberry Pi 4 Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Arch Linux ARM Raspberry Pi 4 Rules

- Target OS: Arch Linux ARM Raspberry Pi 4.
- Package manager: `pacman`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
pacman -Si <package>
pactree <package>
pacman -Ss <term>
```
- Recommended install command style:
```bash
sudo pacman -Syu
sudo pacman -S <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
base
base-devel
selected DE packages
large practical package set
```

## Core Package Set

```text
acl
alsa-utils
ansible
apache
apparmor
attr
audacity
audit
base
base-devel
bash-completion
bind
blueman
bluez
borg
btrfs-progs
buildah
ca-certificates
cifs-utils
cmake
composer
cronie
cups
curl
deja-dup
dmidecode
docker
docker-compose
dolphin-emu
dosbox
emacs-nox
ethtool
evince
fail2ban
fd
ffmpeg
file-roller
firefox
flatpak
fzf
gamemode
gcc
gcompris-qt
gdb
gimp
git
git-lfs
github-cli
gnupg
go
gparted
gradle
graphviz
gzip
hdparm
htop
httpie
inkscape
iperf3
iproute2
iputils
jdk-openjdk
jq
jstest-gtk
keepassxc
krita
less
libreoffice-still
linux
linux-firmware
lm_sensors
logrotate
lshw
lutris
lvm2
make
man-db
man-pages
mangohud
mariadb
mariadb-libs
maven
mdadm
mercurial
mesa-utils
meson
mtr
nano
ncdu
neovim
net-tools
networkmanager
nfs-utils
nftables
nginx
ninja
nmap
nodejs
noto-fonts
noto-fonts-emoji
npm
nvidia
nvidia-utils
nvme-cli
nvtop
obs-studio
openbsd-netcat
openssh
p7zip
pandoc
pavucontrol
pciutils
perl
php
pipewire
pipewire-pulse
pipx
pkgconf
plantuml
podman
postgresql
postgresql-libs
prometheus-node-exporter
python
python-pip
python-virtualenv
rclone
redis
restic
retroarch
ripgrep
rsync
ruby
rust
samba
sane-airscan
scratch
screen
scribus
shellcheck
shfmt
simple-scan
skopeo
smartmontools
sqlite
steam
stellarium
subversion
sudo
system-config-printer
systemd-timesyncd
tar
tcpdump
thonny
thunderbird
timeshift
tmux
traceroute
tree
ttf-dejavu
ttf-liberation
tuxmath
tuxtype
ufw
unzip
usbutils
valgrind
vim
vkbasalt
vlc
vulkan-intel
vulkan-radeon
vulkan-tools
wget
wine
winetricks
wireless_tools
wireplumber
wpa_supplicant
xfsprogs
xz
yq
zip
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `gnome gdm`
- KDE Plasma: `plasma kde-applications sddm`
- XFCE: `xfce4 xfce4-goodies lightdm lightdm-gtk-greeter`
- Cinnamon: `cinnamon lightdm lightdm-gtk-greeter`
- MATE: `mate mate-extra lightdm lightdm-gtk-greeter`
- LXQt: `lxqt sddm`
- Minimal Xorg baseline: `xorg-server xorg-xinit` plus chosen window manager

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
sudo pacman -Syu
sudo pacman -S <packages>
```
