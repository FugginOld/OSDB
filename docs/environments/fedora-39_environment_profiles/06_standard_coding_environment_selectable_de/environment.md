# Fedora 39 Standard Coding Environment with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

# Common Fedora 39 Rules

- Target OS: Fedora 39.
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
git
git-lfs
python3
python3-devel
python3-pip
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
nmap-ncat
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
