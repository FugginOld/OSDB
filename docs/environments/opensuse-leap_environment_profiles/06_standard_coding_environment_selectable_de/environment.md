# openSUSE Leap Standard Coding with Selectable DE

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
ansible
buildah
cargo
cmake
composer
curl
docker
docker-compose
emacs-nox
fzf
gcc
gcc-c++
gdb
git
git-lfs
go
gradle
graphviz
httpie
java-devel
jq
make
mariadb
maven
meson
neovim
netcat-openbsd
ninja
nmap
nodejs
npm
osc
pandoc
patterns-devel-base-devel_basis
perl
php7
pipx
pkg-config
plantuml
podman
postgresql
python3
python3-devel
python3-pip
python3-virtualenv
redis
ripgrep
rpm-build
rpmlint
ruby
ruby-devel
rust
screen
ShellCheck
skopeo
sqlite3
tcpdump
tmux
tree
valgrind
vim
wget
yq
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
