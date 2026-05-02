# Ubuntu 24.10 Oracular Standard Coding with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

# Common Ubuntu 24.10 Oracular Rules

- Target OS: Ubuntu 24.10 Oracular.
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
build-essential
openssh-server
optional selected desktop metapackage
```

## Core Package Set

```text
ansible
build-essential
buildah
cargo
cmake
composer
curl
debhelper
default-jdk
devscripts
docker-compose
docker.io
emacs-nox
fakeroot
fzf
g++
gcc
gdb
git
git-lfs
golang
gradle
graphviz
httpie
jq
lintian
make
mariadb-client
maven
meson
neovim
netcat-openbsd
ninja-build
nmap
nodejs
npm
pandoc
perl
php-cli
pipx
pkg-config
plantuml
podman
postgresql-client
python3
python3-dev
python3-pip
python3-venv
redis-tools
ripgrep
ruby
ruby-dev
rustc
screen
shellcheck
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
