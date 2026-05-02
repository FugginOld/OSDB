# openSUSE Leap Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common openSUSE Leap Rules

- Target OS: openSUSE Leap.
- Package manager: `zypper`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
zypper info <package>
zypper search <term>
```
- Recommended install command style:
```bash
sudo zypper refresh
sudo zypper install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
patterns-base-x11
patterns-devel-base-devel_basis
selected server and desktop patterns
```

## Core Package Set

```text
acl
alsa-utils
ansible
apache2
apparmor-utils
attr
audacity
audit
bash-completion
bind-utils
blueman
bluez
borgbackup
btrfsprogs
buildah
ca-certificates
cargo
chrony
cifs-utils
cmake
composer
cron
cups
curl
dejavu-fonts
dmidecode
docker
docker-compose
dosbox
emacs-nox
ethtool
evince
fail2ban
ffmpeg
file-roller
firefox
firewalld
flatpak
fzf
gamemode
gcc
gcc-c++
gcompris-qt
gdb
gimp
git
git-lfs
go
gparted
gpg2
gradle
graphviz
gzip
hdparm
htop
httpie
inkscape
iperf
iproute2
iputils
java-devel
joystick
jq
keepassxc
krita
less
liberation-fonts
libreoffice
logrotate
lshw
lutris
lvm2
make
man
man-pages
mangohud
mariadb
maven
mdadm
Mesa-demo-x
Mesa-vulkan-device-select
meson
mtr
nano
ncdu
neovim
net-tools
netcat-openbsd
NetworkManager
nfs-client
nftables
nginx
ninja
nmap
nodejs
noto-coloremoji-fonts
noto-fonts
npm
nvidia-video-G06
nvme-cli
nvtop
obs-studio
openssh
osc
p7zip
pandoc
patterns-devel-base-devel_basis
pavucontrol
pciutils
perl
php7
pipewire
pipx
pkg-config
plantuml
podman
postgresql
postgresql-server
prometheus-node_exporter
python3
python3-devel
python3-pip
python3-virtualenv
rclone
redis
restic
retroarch
ripgrep
rpm-build
rpmlint
rsync
ruby
ruby-devel
rust
samba-client
sane-backends
scratch
screen
scribus
sensors
ShellCheck
simple-scan
skopeo
smartmontools
sqlite3
steam
stellarium
sudo
system-config-printer
tar
tcpdump
thonny
thunderbird
tmux
traceroute
tree
tuxmath
tuxtype
unzip
usbutils
valgrind
vim
vim-small
vlc
vulkan-tools
wget
wine
winetricks
wireless-tools
wireplumber
wpa_supplicant
xfsprogs
xz
yq
zip
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `patterns-gnome-gnome`
- KDE Plasma: `patterns-kde-kde_plasma`
- XFCE: `patterns-xfce-xfce`
- LXQt: `patterns-lxqt-lxqt`
- MATE: `patterns-mate-mate`
- IceWM minimal GUI: `icewm xorg-x11-server`
- Generic desktop base: `patterns-base-x11`

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
sudo zypper refresh
sudo zypper install <packages>
```
