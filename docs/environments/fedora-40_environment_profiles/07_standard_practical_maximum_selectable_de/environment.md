# Fedora 40 Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical workstation/server hybrid. This is not every package; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Fedora 40 Rules

- Target OS: Fedora 40.
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
- Avoid installing every package in the archive. â€œPractical maximumâ€ means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
@server-product-environment
@development-tools
selected desktop environment group
```

## Core Package Set

```text
sudo
openssh-server
ca-certificates
curl
wget
gnupg2
nano
vim-minimal
less
man-db
bash-completion
iproute
iputils
bind-utils
traceroute
firewalld
nftables
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
cronie
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
audit-libs
net-tools
tcpdump
nmap
mtr
ethtool
iperf3
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
httpd
mariadb-server
postgresql-server
redis
node_exporter
NetworkManager
pipewire
wireplumber
pavucontrol
alsa-utils
bluez
blueman
cups
system-config-printer
sane-backends
sane-airscan
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
dejavu-sans-fonts
liberation-fonts
google-noto-emoji-fonts
git
steam
lutris
wine
winetricks
gamemode
mangohud
mesa-demos
vulkan-tools
mesa-vulkan-drivers
nvidia-driver
obs-studio
ffmpeg
joystick-support
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
google-noto-fonts-common
@development-tools
rpmdevtools
rpmlint
mock
pkgconf-pkg-config
cmake
meson
ninja-build
make
gcc
gcc-c++
gdb
valgrind
git-lfs
python3-devel
pipx
nodejs
npm
golang
rust
cargo
java-latest-openjdk-devel
maven
gradle
php-cli
composer
ruby
ruby-devel
perl
sqlite
postgresql
mariadb
buildah
skopeo
ansible
ShellCheck
jq
yq
httpie
nmap-ncat
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

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
