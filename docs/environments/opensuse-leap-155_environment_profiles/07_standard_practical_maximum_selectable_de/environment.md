# openSUSE Leap 15.5 Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common openSUSE Leap 15.5 Rules

- Target OS: openSUSE Leap 15.5.
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
- Avoid installing every package in the archive. â€œPractical maximumâ€ means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
patterns-base-x11
patterns-devel-base-devel_basis
selected server and desktop patterns
```

## Core Package Set

```text
sudo
openssh
ca-certificates
curl
wget
gpg2
nano
vim-small
less
man
man-pages
bash-completion
net-tools
iproute2
iputils
bind-utils
traceroute
nftables
firewalld
chrony
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
audit
apparmor-utils
tcpdump
nmap
mtr
ethtool
iperf
nvme-cli
hdparm
sensors
mdadm
lvm2
xfsprogs
btrfsprogs
nfs-client
samba-client
cifs-utils
podman
docker
docker-compose
nginx
apache2
mariadb
postgresql-server
redis
prometheus-node_exporter
NetworkManager
wireless-tools
wpa_supplicant
pipewire
wireplumber
pavucontrol
alsa-utils
bluez
blueman
cups
system-config-printer
sane-backends
simple-scan
firefox
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
dejavu-fonts
liberation-fonts
noto-coloremoji-fonts
git
steam
lutris
wine
winetricks
gamemode
mangohud
Mesa-demo-x
vulkan-tools
Mesa-vulkan-device-select
nvidia-video-G06
obs-studio
ffmpeg
joystick
retroarch
dosbox
p7zip
nvtop
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
noto-fonts
patterns-devel-base-devel_basis
rpm-build
rpmlint
osc
pkg-config
cmake
meson
ninja
make
gcc
gcc-c++
gdb
valgrind
git-lfs
python3-devel
python3-virtualenv
pipx
nodejs
npm
go
rust
cargo
java-devel
maven
gradle
php7
composer
ruby
ruby-devel
perl
sqlite3
postgresql
buildah
skopeo
ansible
ShellCheck
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

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
