# Fedora 42 Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Fedora 42 Rules

- Target OS: Fedora 42.
- Package manager: `dnf`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
dnf info <package>
dnf repoquery --requires <package>
dnf search <term>
```
- Recommended install command style:
```bash
sudo dnf upgrade --refresh
sudo dnf install <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
@server-product-environment
@development-tools
selected desktop environment group
```

## Core Package Set

```text
@development-tools
acl
alsa-utils
ansible
attr
audacity
audit
audit-libs
bash-completion
bind-utils
blueman
bluez
borgbackup
btrfs-progs
buildah
ca-certificates
cargo
chrony
cifs-utils
cmake
composer
cronie
cups
curl
dejavu-sans-fonts
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
gnupg2
golang
google-noto-emoji-fonts
google-noto-fonts-common
gparted
gradle
graphviz
gzip
hdparm
htop
httpd
httpie
inkscape
iperf3
iproute
iputils
java-latest-openjdk-devel
joystick-support
jq
keepassxc
krita
less
liberation-fonts
libreoffice
lm_sensors
logrotate
lshw
lutris
lvm2
make
man-db
mangohud
mariadb
mariadb-server
maven
mdadm
mesa-demos
mesa-vulkan-drivers
meson
mock
mtr
nano
ncdu
neovim
net-tools
NetworkManager
nfs-utils
nftables
nginx
ninja-build
nmap
nmap-ncat
node_exporter
nodejs
npm
nvidia-driver
nvme-cli
nvtop
obs-studio
openssh-server
p7zip
pandoc
pavucontrol
pciutils
perl
php-cli
pipewire
pipx
pkgconf-pkg-config
plantuml
podman
postgresql
postgresql-server
python3
python3-devel
python3-pip
rclone
redis
restic
retroarch
ripgrep
rpmdevtools
rpmlint
rsync
ruby
ruby-devel
rust
samba
sane-airscan
sane-backends
scratch
screen
scribus
ShellCheck
simple-scan
skopeo
smartmontools
sqlite
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
vim-minimal
vlc
vulkan-tools
wget
wine
winetricks
wireplumber
xfsprogs
xz
yq
zip
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME Workstation: `@workstation-product-environment`
- KDE Plasma: `@kde-desktop-environment`
- XFCE: `@xfce-desktop-environment`
- Cinnamon: `@cinnamon-desktop-environment`
- MATE: `@mate-desktop-environment`
- LXQt: `@lxqt-desktop-environment`
- Server with GUI: `@graphical-server-environment`

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
sudo dnf upgrade --refresh
sudo dnf install <packages>
```
