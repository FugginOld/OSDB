# Gentoo Linux Standard Coding Environment with Selectable DE

## Purpose

Developer workstation or build server profile for coding, automation, containers, testing, documentation, and LLM-assisted code generation.

## Default Installation Mode

Headless allowed for build server; desktop optional for workstation IDE use.

# Common Gentoo Linux Rules

- Target OS: Gentoo Linux.
- Package manager: `portage/emerge`.
- Default install should remain headless unless this profile says desktop is required.
- Optional desktop environments are selectable and should not be installed together unless explicitly requested.
- Use official distribution repository packages first.
- Enable third-party repositories only when needed for firmware, codecs, Steam, NVIDIA/proprietary GPU drivers, or vendor tooling.
- Validate package availability before building automation:
```bash
emerge --search <term>
equery depends <package>
```
- Recommended install command style:
```bash
sudo emerge --sync
sudo emerge --ask <packages>
```
- Avoid installing every package in the archive. “Practical maximum” means a broad usable profile, not the full repository.

## Distro / Group / Task Packages

```text
selected developer toolchain packages
```

## Core Package Set

```text
sys-devel/gcc
sys-devel/gdb
dev-util/cmake
dev-util/meson
dev-util/ninja
dev-vcs/git
dev-vcs/git-lfs
dev-lang/python
dev-python/pip
dev-python/virtualenv
dev-lang/nodejs
dev-lang/go
dev-lang/rust-bin
virtual/jdk
dev-java/maven-bin
dev-java/gradle-bin
dev-lang/php
dev-php/composer
dev-lang/ruby
dev-lang/perl
dev-db/sqlite
dev-db/postgresql
dev-db/mariadb
dev-db/redis
app-containers/docker
app-containers/docker-compose
app-containers/podman
app-admin/ansible
app-shells/shellcheck
app-misc/jq
app-editors/vim
app-editors/neovim
app-editors/emacs
app-misc/tmux
sys-apps/ripgrep
app-shells/fzf
app-text/pandoc
```

## Selectable Desktop Environment Options

Install **one** of the following when a GUI is requested:

- GNOME: `gnome gdm`
- KDE Plasma: `plasma-meta sddm`
- XFCE: `xfce4-meta lightdm`
- Cinnamon: `cinnamon lightdm`
- MATE: `mate lightdm`
- LXQt: `lxqt-meta sddm`
- Minimal Xorg baseline: `xorg-server xinit` plus chosen window manager

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
sudo emerge --sync
sudo emerge --ask <packages>
```

## LLM Build Notes

- Treat this file as a planning profile, not a guaranteed resolved dependency lockfile.
- Resolve package names against the selected distro release and CPU architecture.
- For Raspberry Pi, ARM, or older/EOL releases, expect some desktop, gaming, container, or GPU packages to differ or be unavailable.
- Services are populated by installed packages; enable only the services needed for the selected role.
