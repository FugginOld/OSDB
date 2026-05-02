# Debian Trixie Standard Coding Environment with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

## Common Debian Trixie Rules

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
- Avoid installing every package in Debian. "Full install" here means practical profile maximum, not the full Debian archive.`r`n`r`n## Debian Task Packages

```text
task-standard
task-ssh-server
optional task-desktop + selected DE
```

## Core Package Set

```text
build-essential
devscripts
debhelper
fakeroot
lintian
pkg-config
cmake
meson
ninja-build
make
gcc
g++
gdb
valgrind
git
git-lfs
gh
subversion
mercurial
python3
python3-dev
python3-pip
python3-venv
pipx
python3-poetry
python3-pytest
ruff
mypy
nodejs
npm
yarnpkg
golang
rustc
cargo
default-jdk
maven
gradle
php-cli
composer
ruby
ruby-dev
perl
sqlite3
postgresql-client
mariadb-client
redis-tools
docker.io
docker-compose
compose-switch
podman
buildah
skopeo
ansible
terraform
vagrant
shellcheck
shfmt
jq
yq
xmlstarlet
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
fd-find
fzf
tree
graphviz
plantuml
pandoc
texlive-latex-recommended
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

For a generic Debian desktop baseline, pair the chosen DE with `task-desktop` unless the chosen task already pulls the expected desktop stack.`r`n`r`n## Services / Daemons Expected

```text
ssh
docker or podman
postgresql optional local dev
redis optional local dev
```

## Exclusions / Guardrails

```text
full desktop if running as CI/build server
gaming stack
education bulk
```

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
