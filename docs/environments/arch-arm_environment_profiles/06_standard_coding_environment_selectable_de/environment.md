# Arch Linux ARM Standard Coding with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

# Common Arch Linux ARM Rules

- Target OS: Arch Linux ARM.
- Package manager: `pacman`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
pacman -Si <package>
pactree <package>
pacman -Ss <term>
```
- Recommended install command style:
```bash
sudo pacman -Syu
sudo pacman -S <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
base-devel
optional selected DE packages
```

## Core Package Set

```text
ansible
base-devel
buildah
cmake
composer
curl
docker
docker-compose
emacs-nox
fd
fzf
gcc
gdb
git
git-lfs
github-cli
go
gradle
graphviz
httpie
jdk-openjdk
jq
make
mariadb-libs
maven
mercurial
meson
neovim
ninja
nmap
nodejs
npm
openbsd-netcat
pandoc
perl
php
pipx
pkgconf
plantuml
podman
postgresql-libs
python
python-pip
python-virtualenv
redis
ripgrep
ruby
rust
screen
shellcheck
shfmt
skopeo
sqlite
subversion
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

- GNOME: `gnome gdm`
- KDE Plasma: `plasma kde-applications sddm`
- XFCE: `xfce4 xfce4-goodies lightdm lightdm-gtk-greeter`
- Cinnamon: `cinnamon lightdm lightdm-gtk-greeter`
- MATE: `mate mate-extra lightdm lightdm-gtk-greeter`
- LXQt: `lxqt sddm`
- Minimal Xorg baseline: `xorg-server xorg-xinit` plus chosen window manager

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
sudo pacman -Syu
sudo pacman -S <packages>
```
