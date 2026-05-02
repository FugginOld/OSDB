# Debian 9 Stretch Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Debian 9 Stretch Rules

- Target OS: Debian 9 Stretch.
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
- Avoid installing every package in the archive. â€œPractical maximumâ€ means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
task-standard
task-ssh-server
task-desktop
one selected DE task
```

## Core Package Set

```text
sudo
openssh-server
ca-certificates
apt-transport-https
curl
wget
gnupg
lsb-release
locales
tzdata
nano
vim-tiny
less
man-db
bash-completion
net-tools
iproute2
iputils-ping
dnsutils
traceroute
nftables
ufw
systemd-timesyncd
rsync
tar
gzip
xz-utils
unzip
zip
pciutils
usbutils
lshw
dmidecode
smartmontools
htop
ncdu
cron
logrotate
vim
tmux
screen
borgbackup
restic
rclone
acl
attr
fail2ban
auditd
apparmor
apparmor-utils
tcpdump
nmap
mtr-tiny
ethtool
iperf3
nvme-cli
hdparm
lm-sensors
mdadm
lvm2
xfsprogs
btrfs-progs
nfs-common
samba
cifs-utils
podman
docker.io
docker-compose
nginx
apache2
mariadb-server
postgresql
redis-server
prometheus-node-exporter
network-manager
network-manager-gnome
wireless-tools
wpasupplicant
pipewire
wireplumber
pavucontrol
alsa-utils
bluetooth
bluez
blueman
cups
system-config-printer
printer-driver-all
sane-airscan
simple-scan
firefox-esr
thunderbird
libreoffice
evince
file-roller
gparted
vlc
gimp
inkscape
keepassxc
flatpak
fonts-dejavu
fonts-liberation
fonts-noto
fonts-noto-color-emoji
timeshift
deja-dup
git
steam-installer
lutris
wine
winetricks
gamemode
mangohud
mesa-utils
vulkan-tools
mesa-vulkan-drivers
firmware-linux
firmware-linux-nonfree
firmware-amd-graphics
firmware-misc-nonfree
nvidia-driver
nvidia-settings
obs-studio
ffmpeg
joystick
retroarch
dosbox
p7zip-full
nvtop
education-desktop-other
education-common
education-tasks
krita
scribus
stellarium
gcompris-qt
tuxmath
tuxtype
scratch
thonny
python3
python3-pip
audacity
build-essential
devscripts
debhelper
fakeroot
lintian
pkg-config
cmake
meson
ninja-build
make
gcc
g++
gdb
valgrind
git-lfs
python3-dev
python3-venv
pipx
nodejs
npm
golang
rustc
cargo
default-jdk
maven
gradle
php-cli
composer
ruby
ruby-dev
perl
sqlite3
postgresql-client
mariadb-client
redis-tools
buildah
skopeo
ansible
shellcheck
jq
yq
httpie
netcat-openbsd
neovim
emacs-nox
ripgrep
fzf
tree
graphviz
plantuml
pandoc
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

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.

