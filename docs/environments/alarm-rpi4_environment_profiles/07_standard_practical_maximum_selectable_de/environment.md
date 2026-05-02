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
base
linux
linux-firmware
sudo
openssh
ca-certificates
curl
wget
gnupg
nano
vim
less
man-db
man-pages
bash-completion
net-tools
iproute2
iputils
bind
traceroute
nftables
ufw
systemd-timesyncd
rsync
tar
gzip
xz
unzip
zip
pciutils
usbutils
lshw
dmidecode
smartmontools
htop
ncdu
cronie
logrotate
base
linux
linux-firmware
sudo
openssh
vim
nano
tmux
screen
rsync
borg
restic
rclone
logrotate
cronie
acl
attr
ufw
nftables
fail2ban
audit
apparmor
iproute2
net-tools
bind
tcpdump
nmap
mtr
ethtool
iperf3
lshw
dmidecode
pciutils
usbutils
smartmontools
nvme-cli
hdparm
lm_sensors
mdadm
lvm2
xfsprogs
btrfs-progs
nfs-utils
samba
cifs-utils
podman
docker
docker-compose
nginx
apache
mariadb
postgresql
redis
prometheus-node-exporter
sudo
networkmanager
wireless_tools
wpa_supplicant
pipewire
wireplumber
pipewire-pulse
pavucontrol
alsa-utils
bluez
blueman
cups
system-config-printer
sane-airscan
simple-scan
firefox
thunderbird
libreoffice-still
evince
file-roller
gparted
vlc
gimp
inkscape
keepassxc
flatpak
ttf-dejavu
ttf-liberation
noto-fonts
noto-fonts-emoji
timeshift
deja-dup
rsync
curl
wget
git
vim
nano
htop
ncdu
sudo
networkmanager
pipewire
wireplumber
pipewire-pulse
pavucontrol
steam
lutris
wine
winetricks
gamemode
mangohud
vkbasalt
mesa-utils
vulkan-tools
vulkan-radeon
vulkan-intel
nvidia
nvidia-utils
obs-studio
ffmpeg
vlc
jstest-gtk
retroarch
dolphin-emu
dosbox
p7zip
unzip
curl
wget
git
htop
nvtop
lm_sensors
libreoffice-still
firefox
thunderbird
gimp
inkscape
krita
scribus
stellarium
gcompris-qt
tuxmath
tuxtype
scratch
thonny
python
python-pip
git
vlc
audacity
obs-studio
cups
sane-airscan
simple-scan
noto-fonts
noto-fonts-emoji
base-devel
pkgconf
cmake
meson
ninja
make
gcc
gdb
valgrind
git
git-lfs
github-cli
subversion
mercurial
python
python-pip
python-virtualenv
pipx
nodejs
npm
go
rust
jdk-openjdk
maven
gradle
php
composer
ruby
perl
sqlite
postgresql-libs
mariadb-libs
redis
docker
docker-compose
podman
buildah
skopeo
ansible
shellcheck
shfmt
jq
yq
curl
wget
httpie
nmap
tcpdump
openbsd-netcat
vim
neovim
emacs-nox
tmux
screen
ripgrep
fd
fzf
tree
graphviz
plantuml
pandoc
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

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
