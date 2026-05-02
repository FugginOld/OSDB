# Debian Trixie Standard Practical Maximum Install with Selectable DE

## Purpose

Large but practical Debian workstation/server hybrid. This is not all Debian packages; it is a broad, usable maximum for power users, labs, and LLM build planning.

## Default Installation Mode

Desktop optional but recommended. Select one DE. Includes server, coding, desktop, media, education, virtualization, and admin tooling.

# Common Debian Trixie Rules

- Target OS: Debian 13 “Trixie”.
- Package manager: `apt`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use Debian repository packages first.
- Enable `contrib`, `non-free`, and `non-free-firmware` only when firmware, Steam, or proprietary hardware support is required.
- Validate package availability before building automation:
  - `apt-cache policy <package>`
  - `apt-cache depends <package>`
  - `apt-cache search <term>`
- Recommended install command style:
  - `sudo apt update`
  - `sudo apt install --no-install-recommends <packages>` for lean installs
  - `sudo apt install <packages>` for standard installs
- Avoid installing every package in Debian. “Full install” here means practical profile maximum, not the full Debian archive.


## Debian Task Packages

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
task-standard
network-manager
pipewire
pipewire-audio
wireplumber
cups
bluetooth
bluez
firefox-esr
thunderbird
libreoffice
gimp
inkscape
krita
scribus
vlc
obs-studio
ffmpeg
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
gcc
g++
gdb
valgrind
git
git-lfs
gh
python3
python3-dev
python3-pip
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
docker.io
docker-compose
podman
buildah
ansible
terraform
vagrant
qemu-system
libvirt-daemon-system
virt-manager
virtinst
nginx
apache2
mariadb-server
postgresql
redis-server
sqlite3
nfs-common
samba
cifs-utils
rsync
borgbackup
restic
rclone
ufw
nftables
fail2ban
auditd
apparmor
apparmor-utils
smartmontools
nvme-cli
hdparm
lshw
dmidecode
pciutils
usbutils
lm-sensors
htop
iotop
iftop
nload
ncdu
steam-installer
lutris
wine
winetricks
gamemode
mangohud
vulkan-tools
mesa-vulkan-drivers
education-desktop-other
education-development
education-mathematics
education-highschool
fonts-dejavu
fonts-liberation
fonts-noto
fonts-noto-color-emoji
flatpak
gnome-software-plugin-flatpak
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `task-gnome-desktop`
- KDE Plasma: `task-kde-desktop`
- XFCE: `task-xfce-desktop`
- Cinnamon: `task-cinnamon-desktop`
- MATE: `task-mate-desktop`
- LXQt: `task-lxqt-desktop`
- LXDE: `task-lxde-desktop`

For a generic Debian desktop baseline, pair the chosen DE with `task-desktop` unless the chosen task already pulls the expected desktop stack.


## Services / Daemons Expected

```text
ssh
NetworkManager
PipeWire
CUPS
Docker/Podman
libvirt
database services optional
fail2ban/auditd/apparmor
```

## Exclusions / Guardrails

```text
Do not install every Debian archive package
avoid multiple DEs unless intentionally testing them
avoid proprietary GPU packages unless hardware-selected
```

## Notes

- Use this for broad compatibility/testing, not for minimal production.
- Expect high disk usage and larger attack surface.

## Example Install Pattern

Headless/default profile:

```bash
sudo apt update
sudo apt install <packages-from-this-file>
```

Optional DE:

```bash
sudo apt update
sudo apt install task-desktop <selected-desktop-task>
```

## LLM Build Instructions

When using this file to generate code, scripts, Ansible roles, Dockerfiles, or installers:

1. Treat task packages and package names as Debian Trixie `apt` targets.
2. Validate package availability before finalizing automation.
3. Keep desktop environment selection as a variable.
4. Do not install multiple DE tasks unless the user explicitly requests multi-DE testing.
5. Prefer idempotent scripts.
6. Separate base/headless packages from optional GUI packages.
7. Add hardware-specific packages only when detected or selected.
