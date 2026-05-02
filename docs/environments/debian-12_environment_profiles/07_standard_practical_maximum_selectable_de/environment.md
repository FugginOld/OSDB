# Debian 12 Bookworm Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Debian 12 Bookworm Rules

- Target OS: Debian 12 Bookworm.
- Package manager: `apt`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
apt-cache policy <package>
apt-cache depends <package>
apt-cache search <term>
```
- Recommended install command style:
```bash
sudo apt update
sudo apt install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
task-standard
task-ssh-server
task-desktop
one selected DE task
```

## Core Package Set

```text
acl
alsa-utils
ansible
apache2
apparmor
apparmor-utils
apt-transport-https
attr
audacity
auditd
bash-completion
blueman
bluetooth
bluez
borgbackup
btrfs-progs
build-essential
buildah
ca-certificates
cargo
cifs-utils
cmake
composer
cron
cups
curl
debhelper
default-jdk
deja-dup
devscripts
dmidecode
dnsutils
docker-compose
docker.io
dosbox
education-common
education-desktop-other
education-tasks
emacs-nox
ethtool
evince
fail2ban
fakeroot
ffmpeg
file-roller
firefox-esr
firmware-amd-graphics
firmware-linux
firmware-linux-nonfree
firmware-misc-nonfree
flatpak
fonts-dejavu
fonts-liberation
fonts-noto
fonts-noto-color-emoji
fzf
g++
gamemode
gcc
gcompris-qt
gdb
gimp
git
git-lfs
gnupg
golang
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
iputils-ping
joystick
jq
keepassxc
krita
less
libreoffice
lintian
lm-sensors
locales
logrotate
lsb-release
lshw
lutris
lvm2
make
man-db
mangohud
mariadb-client
mariadb-server
maven
mdadm
mesa-utils
mesa-vulkan-drivers
meson
mtr-tiny
nano
ncdu
neovim
net-tools
netcat-openbsd
network-manager
network-manager-gnome
nfs-common
nftables
nginx
ninja-build
nmap
nodejs
npm
nvidia-driver
nvidia-settings
nvme-cli
nvtop
obs-studio
openssh-server
p7zip-full
pandoc
pavucontrol
pciutils
perl
php-cli
pipewire
pipx
pkg-config
plantuml
podman
postgresql
postgresql-client
printer-driver-all
prometheus-node-exporter
python3
python3-dev
python3-pip
python3-venv
rclone
redis-server
redis-tools
restic
retroarch
ripgrep
rsync
ruby
ruby-dev
rustc
samba
sane-airscan
scratch
screen
scribus
shellcheck
simple-scan
skopeo
smartmontools
sqlite3
steam-installer
stellarium
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
tuxmath
tuxtype
tzdata
ufw
unzip
usbutils
valgrind
vim
vim-tiny
vlc
vulkan-tools
wget
wine
winetricks
wireless-tools
wireplumber
wpasupplicant
xfsprogs
xz-utils
yq
zip
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `task-gnome-desktop` / `ubuntu-desktop`
- KDE Plasma: `task-kde-desktop` / `kubuntu-desktop`
- XFCE: `task-xfce-desktop` / `xubuntu-desktop`
- Cinnamon: `task-cinnamon-desktop` / `ubuntucinnamon-desktop`
- MATE: `task-mate-desktop` / `ubuntu-mate-desktop`
- LXQt/Lubuntu: `task-lxqt-desktop` / `lubuntu-desktop`
- LXDE: `task-lxde-desktop` where available

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
sudo apt update
sudo apt install <packages>
```
