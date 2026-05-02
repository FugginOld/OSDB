# Fedora 42 Standard Coding with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

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
@development-tools
optional selected desktop environment group
```

## Core Package Set

```text
@development-tools
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
golang
gradle
graphviz
httpie
java-latest-openjdk-devel
jq
make
mariadb
maven
meson
mock
neovim
ninja-build
nmap
nmap-ncat
nodejs
npm
pandoc
perl
php-cli
pipx
pkgconf-pkg-config
plantuml
podman
postgresql
python3
python3-devel
python3-pip
redis
ripgrep
rpmdevtools
rpmlint
ruby
ruby-devel
rust
screen
ShellCheck
skopeo
sqlite
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
