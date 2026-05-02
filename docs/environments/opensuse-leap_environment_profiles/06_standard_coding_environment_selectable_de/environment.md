# openSUSE Leap Standard Coding Environment with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

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
patterns-devel-base-devel_basis
optional selected desktop pattern
```

## Core Package Set

```text
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
git
git-lfs
python3
python3-devel
python3-pip
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
mariadb
redis
docker
docker-compose
podman
buildah
skopeo
ansible
ShellCheck
jq
yq
curl
wget
httpie
nmap
tcpdump
netcat-openbsd
vim
neovim
emacs-nox
tmux
screen
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
