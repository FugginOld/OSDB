/* ============================================================
   Linux Distro Builder Wizard — wizard.js
   All data, state machine, renderers, and script generators.
   No external dependencies — runs fully in the browser.
   ============================================================ */

'use strict';

// ============================================================
// DATA LAYER
// ============================================================

const BASES = {

  // ── Debian ─────────────────────────────────────────────────
  'debian-10': {
    label: 'Debian 10 Buster', family: 'debian', suite: 'buster',
    track: 'legacy', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.debian.org/debian',
    areas: 'main contrib non-free',
    des: ['gnome','kde','cinnamon','xfce','lxde','mate','qtile','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
    eol: true,
  },
  'debian-11': {
    label: 'Debian 11 Bullseye', family: 'debian', suite: 'bullseye',
    track: 'oldstable', builder: 'live-build', pkg: 'apt',
    mirror: 'http://deb.debian.org/debian',
    areas: 'main contrib non-free',
    des: ['gnome','kde','cinnamon','xfce','lxde','mate','qtile','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
  },
  'debian-12': {
    label: 'Debian 12 Bookworm', family: 'debian', suite: 'bookworm',
    track: 'oldstable', builder: 'live-build', pkg: 'apt',
    mirror: 'http://deb.debian.org/debian',
    areas: 'main contrib non-free non-free-firmware',
    des: ['gnome','kde','cinnamon','xfce','lxqt','mate','qtile','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
  },
  'debian-13': {
    label: 'Debian 13 Trixie', family: 'debian', suite: 'trixie',
    track: 'testing', unstable: true, builder: 'live-build', pkg: 'apt',
    mirror: 'http://deb.debian.org/debian',
    areas: 'main contrib non-free non-free-firmware',
    des: ['gnome','kde','cinnamon','xfce','lxqt','mate','qtile','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
  },

  // ── Ubuntu ──────────────────────────────────────────────────
  'ubuntu-2004': {
    label: 'Ubuntu 20.04 LTS Focal', family: 'ubuntu', suite: 'focal',
    track: 'lts-legacy', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.ubuntu.com/ubuntu',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','lxde','budgie','qtile','none'],
    installers: ['calamares','ubiquity','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
  },
  'ubuntu-2204': {
    label: 'Ubuntu 22.04 LTS Jammy', family: 'ubuntu', suite: 'jammy',
    track: 'lts', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.ubuntu.com/ubuntu',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','lxqt','budgie','cosmic','qtile','none'],
    installers: ['calamares','ubiquity','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
  },
  'ubuntu-2404': {
    label: 'Ubuntu 24.04 LTS Noble', family: 'ubuntu', suite: 'noble',
    track: 'lts-current', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.ubuntu.com/ubuntu',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','lxqt','budgie','cosmic','qtile','none'],
    installers: ['calamares','ubiquity','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
  },
  'ubuntu-2410': {
    label: 'Ubuntu 24.10 Oracular', family: 'ubuntu', suite: 'oracular',
    track: 'current', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.ubuntu.com/ubuntu',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','lxqt','budgie','cosmic','qtile','none'],
    installers: ['calamares','ubiquity','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
  },
  'ubuntu-2504': {
    label: 'Ubuntu 25.04 Plucky', family: 'ubuntu', suite: 'plucky',
    track: 'current', builder: 'live-build', pkg: 'apt',
    mirror: 'http://archive.ubuntu.com/ubuntu',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','lxqt','budgie','cosmic','qtile','none'],
    installers: ['calamares','ubiquity','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
  },

  // ── Arch ────────────────────────────────────────────────────
  'arch': {
    label: 'Arch Linux (rolling)', family: 'arch', suite: 'rolling',
    track: 'rolling', builder: 'archiso', pkg: 'pacman',
    mirror: 'https://mirror.rackspace.com/archlinux/$repo/os/$arch',
    des: ['kde','gnome','xfce','cinnamon','lxqt','qtile','i3','sway','cosmic','none'],
    installers: ['calamares','archinstall','none'],
    repoTypes: ['official','aur','custom'],
    serviceManager: 'systemd',
  },
  'arch-arm': {
    label: 'Arch Linux ARM', family: 'arch', suite: 'rolling',
    track: 'rolling', builder: 'archiso', pkg: 'pacman',
    arch: 'aarch64',
    des: ['kde','gnome','xfce','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','aur'],
    serviceManager: 'systemd',
  },

  // ── Fedora ──────────────────────────────────────────────────
  'fedora-39': {
    label: 'Fedora 39', family: 'fedora', suite: 'f39',
    track: 'legacy', builder: 'lorax', pkg: 'dnf',
    des: ['gnome','kde','xfce','lxqt','mate','qtile','none'],
    installers: ['anaconda','none'],
    repoTypes: ['official','copr','custom'],
    serviceManager: 'systemd',
  },
  'fedora-40': {
    label: 'Fedora 40', family: 'fedora', suite: 'f40',
    track: 'stable', builder: 'lorax', pkg: 'dnf',
    des: ['gnome','kde','xfce','lxqt','mate','cosmic','qtile','none'],
    installers: ['anaconda','none'],
    repoTypes: ['official','copr','custom'],
    serviceManager: 'systemd',
  },
  'fedora-41': {
    label: 'Fedora 41', family: 'fedora', suite: 'f41',
    track: 'current', builder: 'lorax', pkg: 'dnf',
    des: ['gnome','kde','xfce','lxqt','mate','cosmic','qtile','none'],
    installers: ['anaconda','none'],
    repoTypes: ['official','copr','custom'],
    serviceManager: 'systemd',
  },
  'fedora-42': {
    label: 'Fedora 42', family: 'fedora', suite: 'f42',
    track: 'current', builder: 'lorax', pkg: 'dnf',
    des: ['gnome','kde','xfce','cosmic','qtile','none'],
    installers: ['anaconda','none'],
    repoTypes: ['official','copr'],
    serviceManager: 'systemd',
  },

  // ── Raspberry Pi OS ─────────────────────────────────────────
  'rpios-lite-bookworm': {
    label: 'Raspberry Pi OS Lite (Bookworm)', family: 'rpi', suite: 'bookworm',
    track: 'stable', builder: 'pi-gen', pkg: 'apt',
    arch: 'aarch64', archAlt: 'armhf',
    mirror: 'http://archive.raspberrypi.org/debian',
    areas: 'main',
    des: ['none'],
    installers: ['none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
    imageType: 'img',
    piGenTier: 'lite',
    notes: 'Headless only. SSH enabled by default.',
  },
  'rpios-desktop-bookworm': {
    label: 'Raspberry Pi OS Desktop (Bookworm)', family: 'rpi', suite: 'bookworm',
    track: 'stable', builder: 'pi-gen', pkg: 'apt',
    arch: 'aarch64', archAlt: 'armhf',
    mirror: 'http://archive.raspberrypi.org/debian',
    areas: 'main',
    des: ['labwc','openbox','none'],
    installers: ['none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
    imageType: 'img',
    piGenTier: 'desktop',
    notes: 'Uses labwc (Wayland) on Pi 4/5, Openbox (X11) on older hardware.',
  },
  'rpios-full-bookworm': {
    label: 'Raspberry Pi OS Full (Bookworm)', family: 'rpi', suite: 'bookworm',
    track: 'stable', builder: 'pi-gen', pkg: 'apt',
    arch: 'aarch64', archAlt: 'armhf',
    mirror: 'http://archive.raspberrypi.org/debian',
    areas: 'main',
    des: ['labwc','openbox','none'],
    installers: ['none'],
    repoTypes: ['official','custom'],
    serviceManager: 'systemd',
    imageType: 'img',
    piGenTier: 'full',
    notes: 'Full desktop + recommended apps (Chromium, LibreOffice, Scratch, etc.).',
  },
  'ubuntu-rpi-2204': {
    label: 'Ubuntu 22.04 LTS for RPi', family: 'rpi-ubuntu', suite: 'jammy',
    track: 'lts', builder: 'ubuntu-rpi', pkg: 'apt',
    arch: 'aarch64',
    mirror: 'http://ports.ubuntu.com/ubuntu-ports',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
    imageType: 'img',
    notes: 'Uses debootstrap cross-compiled for aarch64.',
  },
  'ubuntu-rpi-2404': {
    label: 'Ubuntu 24.04 LTS for RPi', family: 'rpi-ubuntu', suite: 'noble',
    track: 'lts-current', builder: 'ubuntu-rpi', pkg: 'apt',
    arch: 'aarch64',
    mirror: 'http://ports.ubuntu.com/ubuntu-ports',
    areas: 'main restricted universe multiverse',
    des: ['gnome','kde','xfce','mate','none'],
    installers: ['calamares','none'],
    repoTypes: ['official','ppa','custom'],
    serviceManager: 'systemd',
    imageType: 'img',
  },
  'alarm-rpi4': {
    label: 'Arch Linux ARM — Pi 4', family: 'rpi-arch', suite: 'rolling',
    track: 'rolling', builder: 'alarm-rpi', pkg: 'pacman',
    arch: 'aarch64',
    mirror: 'http://mirror.archlinuxarm.org/aarch64/$repo',
    des: ['kde','xfce','none'],
    installers: ['none'],
    repoTypes: ['official','aur'],
    serviceManager: 'systemd',
    imageType: 'img',
    notes: 'Manual SD card write via dd. Configure via chroot.',
  },
  'alarm-rpi5': {
    label: 'Arch Linux ARM — Pi 5', family: 'rpi-arch', suite: 'rolling',
    track: 'rolling', builder: 'alarm-rpi', pkg: 'pacman',
    arch: 'aarch64',
    mirror: 'http://mirror.archlinuxarm.org/aarch64/$repo',
    des: ['kde','gnome','xfce','none'],
    installers: ['none'],
    repoTypes: ['official','aur'],
    serviceManager: 'systemd',
    imageType: 'img',
  },

  // ── openSUSE ────────────────────────────────────────────────
  'opensuse-leap': {
    label: 'openSUSE Leap 15.6', family: 'opensuse', suite: 'leap',
    track: 'stable', builder: 'kiwi', pkg: 'zypper',
    des: ['kde','gnome','xfce','none'],
    installers: ['yast','calamares','none'],
    repoTypes: ['official','obs','custom'],
    serviceManager: 'systemd',
  },
  'opensuse-tumbleweed': {
    label: 'openSUSE Tumbleweed', family: 'opensuse', suite: 'tumbleweed',
    track: 'rolling', builder: 'kiwi', pkg: 'zypper',
    des: ['kde','gnome','xfce','lxqt','none'],
    installers: ['yast','calamares','none'],
    repoTypes: ['official','obs','custom'],
    serviceManager: 'systemd',
  },
};

// ── DE → packages mapping ────────────────────────────────────
const DE_PACKAGES = {
  gnome:    { apt: 'gnome-shell gnome-session gdm3 gnome-control-center nautilus', pacman: 'gnome gnome-extra gdm', dnf: 'gnome-shell gdm gnome-control-center nautilus', zypper: 'patterns-gnome-gnome_x11 gdm' },
  kde:      { apt: 'kde-plasma-desktop plasma-nm plasma-pa kscreen sddm', pacman: 'plasma-meta kde-applications sddm', dnf: 'plasma-workspace plasma-nm sddm', zypper: 'patterns-kde-kde_x11 sddm' },
  cinnamon: { apt: 'cinnamon cinnamon-l10n lightdm lightdm-gtk-greeter nemo', pacman: 'cinnamon lightdm lightdm-gtk-greeter nemo', dnf: 'cinnamon lightdm', zypper: 'cinnamon lightdm' },
  xfce:     { apt: 'xfce4 xfce4-goodies lightdm lightdm-gtk-greeter thunar', pacman: 'xfce4 xfce4-goodies lightdm lightdm-gtk-greeter thunar', dnf: 'xfce-desktop lightdm', zypper: 'patterns-xfce-xfce_x11 lightdm' },
  lxqt:     { apt: 'lxqt sddm', pacman: 'lxqt sddm', dnf: 'lxqt-session sddm', zypper: 'lxqt sddm' },
  lxde:     { apt: 'lxde lightdm lightdm-gtk-greeter', pacman: 'lxde lightdm lightdm-gtk-greeter', dnf: 'lxde-desktop lightdm', zypper: 'lxde lightdm' },
  mate:     { apt: 'mate-desktop-environment lightdm lightdm-gtk-greeter', pacman: 'mate mate-extra lightdm lightdm-gtk-greeter', dnf: 'mate-desktop lightdm', zypper: 'mate lightdm' },
  budgie:   { apt: 'budgie-desktop lightdm lightdm-gtk-greeter', pacman: 'budgie-desktop lightdm lightdm-gtk-greeter', dnf: 'budgie-desktop lightdm', zypper: 'budgie-desktop lightdm' },
  cosmic:   { apt: 'cosmic-session cosmic-greeter', pacman: 'cosmic-session sddm', dnf: 'cosmic-session sddm', zypper: '' },
  qtile:    { apt: 'qtile python3-xcffib python3-cairocffi lightdm lightdm-gtk-greeter', pacman: 'qtile lightdm lightdm-gtk-greeter', dnf: 'qtile lightdm', zypper: '' },
  i3:       { apt: 'i3 i3status dmenu xterm lightdm lightdm-gtk-greeter', pacman: 'i3-wm i3status dmenu xterm lightdm lightdm-gtk-greeter', dnf: 'i3 i3status dmenu xterm lightdm', zypper: 'i3 i3status dmenu xterm lightdm' },
  sway:     { apt: 'sway swaybar swaybg swayidle swaylock', pacman: 'sway swaybar swaybg swayidle swaylock', dnf: 'sway', zypper: 'sway' },
  labwc:    { apt: 'labwc waybar wlopm wlr-randr', pacman: 'labwc waybar', dnf: 'labwc waybar', zypper: 'labwc' },
  openbox:  { apt: 'openbox lightdm lightdm-gtk-greeter obconf', pacman: 'openbox lightdm lightdm-gtk-greeter obconf', dnf: 'openbox lightdm', zypper: 'openbox lightdm' },
  none:     { apt: '', pacman: '', dnf: '', zypper: '' },
};

// Display manager per DE
const DE_DM = {
  gnome: 'gdm', kde: 'sddm', lxqt: 'sddm',
  cinnamon: 'lightdm', xfce: 'lightdm', lxde: 'lightdm',
  mate: 'lightdm', budgie: 'lightdm', qtile: 'lightdm', i3: 'lightdm',
  cosmic: 'cosmic-greeter',
  openbox: 'lightdm', sway: null, labwc: null, none: null,
};

// DE display labels
const DE_LABELS = {
  gnome: 'GNOME', kde: 'KDE Plasma', cinnamon: 'Cinnamon',
  xfce: 'XFCE', lxqt: 'LXQt', lxde: 'LXDE', mate: 'MATE',
  budgie: 'Budgie', qtile: 'Qtile (tiling)', i3: 'i3 (tiling)', sway: 'Sway (Wayland)',
  labwc: 'labwc (Wayland)', openbox: 'Openbox', cosmic: 'COSMIC', none: 'Headless / None',
};

// DE brief descriptions shown under the screenshot
const DE_DESCRIPTIONS = {
  gnome:    'Modern, touch-friendly shell focused on simplicity (Wayland/X11)',
  kde:      'Feature-rich, highly customizable Plasma desktop (Wayland/X11)',
  cinnamon: 'Traditional desktop forked from GNOME 3, comfortable on X11',
  xfce:     'Lightweight, fast and modular GTK desktop environment',
  lxqt:     'Lightweight Qt-based desktop environment',
  lxde:     'Extremely lightweight GTK2 desktop environment',
  mate:     'Traditional desktop, continuation of GNOME 2',
  budgie:   'Modern, elegant desktop developed by the Solus project',
  qtile:    'Hackable, Python-configured tiling window manager (X11/Wayland)',
  i3:       'Minimalist keyboard-driven tiling window manager (X11)',
  sway:     'i3-compatible tiling compositor for Wayland',
  labwc:    'Lightweight stacking Wayland compositor (used on Raspberry Pi OS)',
  openbox:  'Minimalist, highly configurable floating window manager',
  cosmic:   'Next-generation Wayland desktop by System76, built in Rust',
};

// DE screenshots
const DE_SCREENSHOTS = {
  gnome:    'assets/de-screenshots/gnome.png',
  kde:      'assets/de-screenshots/kde.png',
  cinnamon: 'assets/de-screenshots/cinnamon.png',
  xfce:     'assets/de-screenshots/xfce.png',
  lxqt:     'assets/de-screenshots/lxqt.png',
  lxde:     'assets/de-screenshots/lxde.svg',
  mate:     'assets/de-screenshots/mate.png',
  budgie:   'assets/de-screenshots/budgie.png',
  qtile:    'assets/de-screenshots/qtile.png',
  i3:       'assets/de-screenshots/i3.png',
  sway:     'assets/de-screenshots/sway.png',
  labwc:    'assets/de-screenshots/labwc.svg',
  openbox:  'assets/de-screenshots/openbox.svg',
  cosmic:   'assets/de-screenshots/cosmic.svg',
};

// ── Per-package compatibility ────────────────────────────────
const PACKAGES = [
  { id: 'firefox',      label: 'Firefox',           families: ['debian','ubuntu','arch','fedora','opensuse','rpi-ubuntu','rpi-arch'], pkgName: { apt: 'firefox-esr',   pacman: 'firefox',        dnf: 'firefox',         zypper: 'firefox'        }, defaultOn: true  },
  // chromium-browser is the apt package name on both RPi OS and Ubuntu for RPi;
  // rpi-arch uses 'chromium' via pacman
  { id: 'chromium',     label: 'Chromium',           families: ['rpi','rpi-ubuntu','rpi-arch'],                                       pkgName: { apt: 'chromium-browser', pacman: 'chromium'                                                          }, defaultOn: true  },
  { id: 'vlc',          label: 'VLC',                families: ['debian','ubuntu','arch','fedora','opensuse','rpi-ubuntu','rpi-arch'], pkgName: { apt: 'vlc',           pacman: 'vlc',            dnf: 'vlc',             zypper: 'vlc'            }, defaultOn: true  },
  { id: 'git',          label: 'Git',                families: ['debian','ubuntu','arch','fedora','opensuse','rpi','rpi-ubuntu','rpi-arch'], pkgName: { apt: 'git',      pacman: 'git',            dnf: 'git',             zypper: 'git'            }, defaultOn: true  },
  { id: 'cups',         label: 'CUPS (printing)',     families: ['debian','ubuntu','arch','fedora','opensuse','rpi-ubuntu'],           pkgName: { apt: 'cups',          pacman: 'cups',           dnf: 'cups',            zypper: 'cups'           }, defaultOn: true  },
  { id: 'libreoffice',  label: 'LibreOffice',         families: ['debian','ubuntu','arch','fedora','opensuse','rpi-ubuntu'],           pkgName: { apt: 'libreoffice',   pacman: 'libreoffice-fresh', dnf: 'libreoffice',  zypper: 'libreoffice'    }, defaultOn: false },
  { id: 'vscode',       label: 'VS Code',             families: ['debian','ubuntu','arch','fedora'],                                  pkgName: { apt: 'code',          pacman: 'code',           dnf: 'code',            zypper: 'code'           }, defaultOn: false },
  { id: 'flatpak',      label: 'Flatpak',             families: ['debian','ubuntu','arch','fedora','opensuse','rpi-ubuntu','rpi-arch'], pkgName: { apt: 'flatpak',      pacman: 'flatpak',        dnf: 'flatpak',         zypper: 'flatpak'        }, defaultOn: false },
  { id: 'snap',         label: 'Snapd',               families: ['ubuntu','rpi-ubuntu'],                                              pkgName: { apt: 'snapd'                                                                                         }, defaultOn: false },
  { id: 'steam',        label: 'Steam',               families: ['debian','ubuntu','arch'],                                           pkgName: { apt: 'steam',         pacman: 'steam',          dnf: 'steam'                                         }, defaultOn: false },
  { id: 'aur-helper',   label: 'AUR helper (yay)',    families: ['arch','rpi-arch'],                                                  pkgName: { pacman: 'yay'                                                                                        }, defaultOn: false },
  { id: 'copr',         label: 'COPR plugin',         families: ['fedora'],                                                           pkgName: { dnf: 'dnf-plugins-core'                                                                              }, defaultOn: false },
  { id: 'rpi-connect',  label: 'RPi Connect',         families: ['rpi'],                                                              pkgName: { apt: 'rpi-connect'                                                                                   }, defaultOn: false },
  { id: 'raspi-config', label: 'raspi-config',        families: ['rpi'],                                                              pkgName: { apt: 'raspi-config'                                                                                  }, defaultOn: true  },
  { id: 'rpi-eeprom',   label: 'RPi EEPROM updater',  families: ['rpi'],                                                              pkgName: { apt: 'rpi-eeprom'                                                                                    }, defaultOn: true  },
  { id: 'gpio-tools',   label: 'GPIO tools',          families: ['rpi','rpi-ubuntu','rpi-arch'],                                      pkgName: { apt: 'gpiod python3-gpiozero', pacman: 'libgpiod'                                                     }, defaultOn: false },
];

// ── Services ─────────────────────────────────────────────────
const SERVICES = [
  // Base services (all families)
  { id: 'NetworkManager', label: 'NetworkManager', unit: 'NetworkManager.service', families: null, defaultOn: true,  desc: 'Automatic network management',    pkgName: { apt: 'network-manager',   pacman: 'networkmanager', dnf: 'NetworkManager',   zypper: 'NetworkManager'   } },
  { id: 'cups',           label: 'CUPS',           unit: 'cups.service',           families: null, defaultOn: true,  desc: 'Printing support',                pkgName: { apt: 'cups',              pacman: 'cups',           dnf: 'cups',             zypper: 'cups'             } },
  { id: 'bluetooth',      label: 'Bluetooth',      unit: 'bluetooth.service',      families: null, defaultOn: true,  desc: 'Bluetooth daemon',                pkgName: { apt: 'bluez',             pacman: 'bluez',          dnf: 'bluez',            zypper: 'bluez'            } },
  { id: 'ufw',            label: 'UFW firewall',   unit: 'ufw.service',            families: null, defaultOn: false, desc: 'Uncomplicated firewall',          pkgName: { apt: 'ufw',               pacman: 'ufw',            dnf: 'ufw',              zypper: 'ufw'              } },
  { id: 'sshd',           label: 'SSH server',     unit: 'ssh.service',            families: null, defaultOn: false, desc: 'OpenSSH daemon (remote access)',  pkgName: { apt: 'openssh-server',    pacman: 'openssh',        dnf: 'openssh-server',   zypper: 'openssh'          } },
  { id: 'docker',         label: 'Docker',         unit: 'docker.service',         families: null, defaultOn: false, desc: 'Container runtime',               pkgName: { apt: 'docker.io',         pacman: 'docker',         dnf: 'docker',           zypper: 'docker'           } },
  { id: 'auto-update',    label: 'Auto-updates',   unit: 'unattended-upgrades.service', families: ['debian','ubuntu','rpi','rpi-ubuntu'], defaultOn: true, desc: 'Automatic security updates (apt)', pkgName: { apt: 'unattended-upgrades' } },
  // RPi-specific services
  { id: 'rpi-eeprom-update', label: 'RPi EEPROM update', unit: 'rpi-eeprom-update.service', families: ['rpi','rpi-ubuntu'], defaultOn: true,  desc: 'Pi 4/5 firmware updater',         pkgName: { apt: 'rpi-eeprom'        } },
  { id: 'raspi-config-svc',  label: 'raspi-config',      unit: 'raspi-config.service',      families: ['rpi'],             defaultOn: true,  desc: 'First-boot configuration tool',   pkgName: { apt: 'raspi-config'      } },
  { id: 'rpi-connect-svc',   label: 'RPi Connect',       unit: 'rpi-connect.service',       families: ['rpi'],             defaultOn: false, desc: 'Raspberry Pi remote access cloud', pkgName: { apt: 'rpi-connect'       } },
  { id: 'pigpiod',           label: 'pigpiod',           unit: 'pigpiod.service',            families: ['rpi','rpi-ubuntu'], defaultOn: false, desc: 'GPIO daemon for Python',           pkgName: { apt: 'pigpio', pacman: 'pigpio' } },
];

// ── RPi hardware targets ─────────────────────────────────────
const RPI_HARDWARE = [
  { id: 'rpi5',   label: 'Raspberry Pi 5',        arch: 'aarch64', notes: 'PCIe, RP1 southbridge, LPDDR4X' },
  { id: 'rpi4',   label: 'Raspberry Pi 4 / CM4',  arch: 'aarch64', notes: 'Most common, VideoCore VI' },
  { id: 'rpi3',   label: 'Raspberry Pi 3 / CM3',  arch: 'aarch64', notes: 'VideoCore IV, limited RAM' },
  { id: 'rpi2',   label: 'Raspberry Pi 2 v1.2+',  arch: 'aarch64', notes: 'Use armhf for v1.1' },
  { id: 'rpi0-2', label: 'Raspberry Pi Zero 2 W', arch: 'aarch64', notes: 'Low-power, same SoC as Pi 3' },
  { id: 'rpi0',   label: 'Raspberry Pi Zero / 1', arch: 'armhf',   notes: 'ARMv6 only — very limited' },
];

// ── RPi config.txt flags ─────────────────────────────────────
const RPI_CONFIG_FLAGS = [
  { id: 'arm_64bit',             label: 'Enable 64-bit kernel',     type: 'bool',  default: true,  line: 'arm_64bit=1'           },
  { id: 'disable_wifi',          label: 'Disable onboard WiFi',     type: 'bool',  default: false, line: 'dtoverlay=disable-wifi' },
  { id: 'disable_bt',            label: 'Disable Bluetooth',        type: 'bool',  default: false, line: 'dtoverlay=disable-bt'   },
  { id: 'i2c',                   label: 'Enable I2C',               type: 'bool',  default: false, line: 'dtoverlay=i2c-arm'      },
  { id: 'spi',                   label: 'Enable SPI',               type: 'bool',  default: false, line: 'dtoverlay=spi0-1cs'     },
  { id: 'camera_auto_detect',    label: 'Auto-detect CSI camera',   type: 'bool',  default: false, line: 'camera_auto_detect=1'   },
  { id: 'display_auto_detect',   label: 'Auto-detect DSI display',  type: 'bool',  default: false, line: 'display_auto_detect=1'  },
  { id: 'gpu_mem',               label: 'GPU memory split (MB)',    type: 'range', default: 128,   min: 16, max: 256, step: 16    },
];

// ── Installer descriptions ───────────────────────────────────
const INSTALLER_DESC = {
  calamares:   'Calamares — graphical, distribution-neutral installer',
  ubiquity:    'Ubiquity — Ubuntu\'s traditional graphical installer',
  anaconda:    'Anaconda — Fedora / Red Hat graphical installer',
  archinstall: 'archinstall — Arch Linux guided CLI installer',
  yast:        'YaST — openSUSE/SUSE graphical installer',
  none:        'No installer — live session only / manual SD write',
};

// ── Repo type descriptions ────────────────────────────────────
const REPO_DESC = {
  official: 'Official distribution repositories only',
  ppa:      'Ubuntu PPAs (Personal Package Archives)',
  aur:      'AUR (Arch User Repository) — community packages',
  copr:     'COPR (Fedora community repositories)',
  obs:      'OBS (openSUSE Build Service) repositories',
  custom:   'Custom mirror URL',
};

// Family groupings for Step 1 display
const FAMILY_GROUPS = [
  { id: 'debian',    label: 'Debian',                 keys: ['debian-10','debian-11','debian-12','debian-13'] },
  { id: 'ubuntu',    label: 'Ubuntu',                 keys: ['ubuntu-2004','ubuntu-2204','ubuntu-2404','ubuntu-2410','ubuntu-2504'] },
  { id: 'arch',      label: 'Arch Linux',             keys: ['arch','arch-arm'] },
  { id: 'fedora',    label: 'Fedora',                 keys: ['fedora-39','fedora-40','fedora-41','fedora-42'] },
  { id: 'rpi',       label: 'Raspberry Pi',           keys: ['rpios-lite-bookworm','rpios-desktop-bookworm','rpios-full-bookworm','ubuntu-rpi-2204','ubuntu-rpi-2404','alarm-rpi4','alarm-rpi5'] },
  { id: 'opensuse',  label: 'openSUSE',               keys: ['opensuse-leap','opensuse-tumbleweed'] },
];

// RPi family identifiers
const RPI_FAMILIES = new Set(['rpi','rpi-ubuntu','rpi-arch']);

// ============================================================
// STATE
// ============================================================

let state = {
  distroName:      'MyDistro',
  base:            null,
  rpiHardware:     null,
  de:              null,
  pkgs:            {},
  repoType:        null,
  customMirrorUrl: '',
  ppaList:         '',
  installer:       null,
  services:        {},
  configTxt:       {},
};

let currentStepIndex = 0;
let baseFilter = 'stable'; // 'stable' | 'all'

// Tracks considered "stable" for the base-filter pill
const STABLE_TRACKS = new Set(['stable', 'oldstable', 'lts', 'lts-current', 'lts-legacy']);

// ============================================================
// STEP COMPUTATION
// ============================================================

function getSteps() {
  const base = state.base ? BASES[state.base] : null;
  const isRpi = base && RPI_FAMILIES.has(base.family);
  const steps = [
    { id: 'base',        label: 'Base'      },
  ];
  if (isRpi) {
    steps.push({ id: 'rpi-hw', label: 'Hardware' });
  }
  steps.push(
    { id: 'de',          label: 'Desktop'   },
    { id: 'packages',    label: 'Packages'  },
    { id: 'repo',        label: 'Repository' },
    { id: 'installer',   label: 'Installer' },
    { id: 'services',    label: 'Services'  },
    { id: 'summary',     label: 'Summary'   },
  );
  return steps;
}

function currentStep() {
  return getSteps()[currentStepIndex];
}

// ============================================================
// UTILITIES
// ============================================================

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function trackBadge(track) {
  return `<span class="badge badge-${esc(track)}">${esc(track)}</span>`;
}

function getBase() {
  return state.base ? BASES[state.base] : null;
}

function isRpiFamily() {
  const b = getBase();
  return b && RPI_FAMILIES.has(b.family);
}

function initDefaultPkgs() {
  const base = getBase();
  if (!base) return;
  state.pkgs = {};
  for (const p of PACKAGES) {
    if (p.families.includes(base.family)) {
      state.pkgs[p.id] = p.defaultOn;
    }
  }
}

function initDefaultServices() {
  const base = getBase();
  if (!base) return;
  state.services = {};
  for (const s of SERVICES) {
    if (s.families === null || s.families.includes(base.family)) {
      state.services[s.id] = s.defaultOn;
    }
  }
  // Special: RPi Lite defaults SSH on
  if (state.base === 'rpios-lite-bookworm') {
    state.services['sshd'] = true;
  }
}

function initDefaultConfigTxt() {
  state.configTxt = {};
  for (const f of RPI_CONFIG_FLAGS) {
    state.configTxt[f.id] = f.default;
  }
}

function getPkgName(pkg) {
  const base = getBase();
  if (!base) return '';
  const name = pkg.pkgName[base.pkg];
  return name || pkg.id;
}

// ============================================================
// NAVIGATION
// ============================================================

function renderAll() {
  renderProgress();
  renderCurrentStep();
  updateNav();
}

function updateNav() {
  const steps = getSteps();
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const cancelBtn = document.getElementById('btn-cancel');

  if (prevBtn) {
    prevBtn.disabled = currentStepIndex === 0;
  }

  if (cancelBtn) {
    cancelBtn.style.display = currentStepIndex > 0 ? '' : 'none';
  }

  const step = currentStep();
  if (step.id === 'summary') {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = '';
    nextBtn.disabled = !canAdvance();
  }
}

function canAdvance() {
  const step = currentStep();
  const base = getBase();
  switch (step.id) {
    case 'base':      return !!state.base;
    case 'rpi-hw':    return !!state.rpiHardware;
    case 'de':        return !!state.de;
    case 'packages':  return true;
    case 'repo':
      if (!state.repoType) return false;
      if (state.repoType === 'custom' && !state.customMirrorUrl.trim()) return false;
      return true;
    case 'installer': return !!state.installer;
    case 'services':  return true;
    default:          return false;
  }
}

function nextStep() {
  const steps = getSteps();
  if (currentStepIndex < steps.length - 1) {
    currentStepIndex++;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function jumpToStep(targetId) {
  const steps = getSteps();
  const idx = steps.findIndex(s => s.id === targetId);
  if (idx !== -1) {
    currentStepIndex = idx;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ============================================================
// PROGRESS BAR
// ============================================================

function renderProgress() {
  const bar = document.getElementById('progress-bar');
  const steps = getSteps();
  bar.innerHTML = steps.map((s, i) => {
    const cls = i < currentStepIndex ? 'completed' : i === currentStepIndex ? 'active' : '';
    const dot = i < currentStepIndex ? '✓' : i + 1;
    return `<div class="progress-step ${cls}" role="listitem">
      <div class="step-dot-wrap" data-step="${i}" title="${esc(s.label)}">
        <div class="step-dot">${dot}</div>
        <div class="step-label">${esc(s.label)}</div>
      </div>
      <div class="step-line"></div>
    </div>`;
  }).join('');

  bar.querySelectorAll('[data-step]').forEach(el => {
    const idx = parseInt(el.dataset.step, 10);
    if (idx < currentStepIndex) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        currentStepIndex = idx;
        renderAll();
      });
    }
  });
}

// ============================================================
// STEP RENDERERS
// ============================================================

function renderCurrentStep() {
  const container = document.getElementById('step-container');
  const step = currentStep();
  switch (step.id) {
    case 'base':     container.innerHTML = renderStepBase();      break;
    case 'rpi-hw':   container.innerHTML = renderStepRpiHw();     break;
    case 'de':       container.innerHTML = renderStepDE();        break;
    case 'packages': container.innerHTML = renderStepPackages();  break;
    case 'repo':     container.innerHTML = renderStepRepo();      break;
    case 'installer':container.innerHTML = renderStepInstaller(); break;
    case 'services': container.innerHTML = renderStepServices();  break;
    case 'summary':  container.innerHTML = renderStepSummary();   break;
  }
  attachStepListeners(step.id);
}

// ── Step 1: Base ─────────────────────────────────────────────
function renderStepBase() {
  const stableActive = baseFilter === 'stable';
  let html = `<h2 class="step-heading">Step 1 — Choose Base System</h2>
    <p class="step-sub">Select the Linux distribution and build toolchain. All subsequent options are derived from this choice.</p>
    <div class="base-filter-bar" role="group" aria-label="Release filter">
      <button class="filter-pill${stableActive ? ' active' : ''}" data-base-filter="stable">Stable Releases</button>
      <button class="filter-pill${!stableActive ? ' active' : ''}" data-base-filter="all">All (incl. Beta / Testing)</button>
    </div>`;

  for (const group of FAMILY_GROUPS) {
    let keys = group.keys.filter(k => BASES[k]);
    if (stableActive) {
      keys = keys.filter(k => STABLE_TRACKS.has(BASES[k].track));
    }
    if (!keys.length) continue;
    html += `<div class="family-group">
      <div class="family-header">${esc(group.label)}</div>
      <div class="tiles" role="radiogroup" aria-label="${esc(group.label)}">`;
    for (const key of keys) {
      const b = BASES[key];
      const sel = state.base === key ? 'selected' : '';
      const eolCls = b.eol ? 'eol' : '';
      const isUnstable = b.unstable || !STABLE_TRACKS.has(b.track);
      const warn = (b.eol || isUnstable)
        ? `<span title="${b.eol ? 'End of Life' : 'Unstable/Testing'}">⚠️</span>` : '';
      const imgBadge = b.imageType === 'img'
        ? `<span class="badge badge-img">img</span>`
        : `<span class="badge badge-iso">iso</span>`;
      const archBadge = b.arch ? `<span class="badge badge-arch">${esc(b.arch)}</span>` : '';
      const builderBadge = `<span class="badge badge-arch">${esc(b.builder)}</span>`;
      const notesTxt = b.notes ? `<div class="tile-notes">${esc(b.notes)}</div>` : '';
      html += `<div class="tile ${sel} ${eolCls}" data-base="${esc(key)}" role="radio" tabindex="0" aria-checked="${sel === 'selected'}">
        <div class="tile-title">${warn} ${esc(b.label)}</div>
        <div class="tile-meta">${trackBadge(b.track)} ${imgBadge} ${archBadge} ${builderBadge}</div>
        ${notesTxt}
      </div>`;
    }
    html += `</div></div>`;
  }
  return html;
}

// ── Step 1b: RPi hardware ─────────────────────────────────────
function renderStepRpiHw() {
  let html = `<h2 class="step-heading">Hardware Target</h2>
    <p class="step-sub">Choose your Raspberry Pi hardware. This determines the CPU architecture (aarch64 vs armhf) and available config.txt flags.</p>
    <div class="tiles" role="radiogroup" aria-label="Raspberry Pi hardware">`;
  for (const hw of RPI_HARDWARE) {
    const sel = state.rpiHardware === hw.id ? 'selected' : '';
    const archBadge = `<span class="badge badge-arch">${esc(hw.arch)}</span>`;
    html += `<div class="tile ${sel}" data-rpi-hw="${esc(hw.id)}" role="radio" tabindex="0" aria-checked="${sel === 'selected'}">
      <div class="tile-title">${esc(hw.label)}</div>
      <div class="tile-meta">${archBadge}</div>
      <div class="tile-notes">${esc(hw.notes)}</div>
    </div>`;
  }
  html += '</div>';
  return html;
}

// ── Step 2: Desktop environment ───────────────────────────────
function renderStepDE() {
  const base = getBase();
  const avail = base ? base.des : ['none'];
  let html = `<h2 class="step-heading">Step 2 — Desktop Environment</h2>
    <p class="step-sub">Choose a desktop environment, or select <em>Headless / None</em> for a minimal server image.</p>
    <div class="tiles" role="radiogroup" aria-label="Desktop environment">`;
  for (const de of avail) {
    const label = DE_LABELS[de] || de;
    const sel = state.de === de ? 'selected' : '';
    const pkgLine = base && DE_PACKAGES[de]
      ? DE_PACKAGES[de][base.pkg] || ''
      : '';
    const dm = DE_DM[de] || '';
    const dmBadge = dm ? `<span class="badge badge-arch">DM: ${esc(dm)}</span>` : '';
    html += `<div class="tile ${sel}" data-de="${esc(de)}" role="radio" tabindex="0" aria-checked="${sel === 'selected'}">
      <div class="tile-title">${esc(label)}</div>
      <div class="tile-meta">${dmBadge}</div>
      ${pkgLine ? `<div class="pkg-preview">${esc(pkgLine)}</div>` : ''}
    </div>`;
  }
  html += '</div>';

  // Screenshot preview — shown below the tiles, updated on hover/selection
  const screenshotUrl = state.de && state.de !== 'none' && DE_SCREENSHOTS[state.de]
    ? DE_SCREENSHOTS[state.de] : '';
  const screenshotLabel = state.de ? (DE_LABELS[state.de] || state.de) : '';
  const screenshotDesc  = state.de ? (DE_DESCRIPTIONS[state.de] || '') : '';
  const captionHtml = screenshotLabel
    ? `<strong>${esc(screenshotLabel)}</strong>${screenshotDesc ? ` — ${esc(screenshotDesc)}` : ''}`
    : '';
  html += `<div class="de-screenshot-wrap"${screenshotUrl ? '' : ' hidden=""'} id="de-screenshot-wrap">
    <img class="de-screenshot-img" id="de-screenshot-img"
      ${screenshotUrl ? `src="${esc(screenshotUrl)}"` : ''} alt="${esc(screenshotLabel)} desktop screenshot"
      decoding="async" referrerpolicy="no-referrer" />
    <p class="de-screenshot-caption" id="de-screenshot-caption">${captionHtml}</p>
  </div>`;

  return html;
}

// ── Step 3: Packages ─────────────────────────────────────────
function renderStepPackages() {
  const base = getBase();
  const avail = base ? PACKAGES.filter(p => p.families.includes(base.family)) : [];
  let html = `<h2 class="step-heading">Step 3 — Packages</h2>
    <p class="step-sub">Toggle additional packages to include. Package names are shown in <em>${base ? base.pkg : 'pkg'}</em> syntax.</p>
    <div class="toggle-list">`;
  for (const pkg of avail) {
    const on = state.pkgs[pkg.id] !== undefined ? state.pkgs[pkg.id] : pkg.defaultOn;
    const cls = on ? 'on' : '';
    const pkgName = getPkgName(pkg);
    html += `<div class="toggle-row ${cls}" data-pkg="${esc(pkg.id)}" role="checkbox" tabindex="0" aria-checked="${on}">
      <div class="toggle-label">
        <strong>${esc(pkg.label)}</strong>
        <span>${esc(pkgName)}</span>
      </div>
      <div class="toggle-switch"></div>
    </div>`;
  }
  html += '</div>';
  if (!avail.length) {
    html += '<p style="color:var(--text-muted)">No additional packages available for this base.</p>';
  }
  return html;
}

// ── Step 4: Repository ───────────────────────────────────────
function renderStepRepo() {
  const base = getBase();
  const avail = base ? base.repoTypes : ['official'];
  let html = `<h2 class="step-heading">Step 4 — Repository</h2>
    <p class="step-sub">Choose which repositories to enable in the build.</p>
    <div class="tiles single-col" role="radiogroup" aria-label="Repository type">`;
  for (const rt of avail) {
    const sel = state.repoType === rt ? 'selected' : '';
    html += `<div class="tile ${sel}" data-repo="${esc(rt)}" role="radio" tabindex="0" aria-checked="${sel === 'selected'}">
      <div class="tile-title">${esc(rt.toUpperCase())}</div>
      <div class="installer-desc">${esc(REPO_DESC[rt] || rt)}</div>
    </div>`;
  }
  html += '</div>';

  if (state.repoType === 'custom') {
    html += `<div class="repo-extra">
      <label for="custom-mirror">Mirror URL</label>
      <input type="text" id="custom-mirror" placeholder="http://my.mirror/debian" value="${esc(state.customMirrorUrl)}" />
    </div>`;
  }
  if (state.repoType === 'ppa') {
    html += `<div class="repo-extra">
      <label for="ppa-list">PPA list (one per line, e.g. ppa:user/name)</label>
      <textarea id="ppa-list" rows="3" placeholder="ppa:user/ppaname">${esc(state.ppaList)}</textarea>
    </div>`;
  }
  return html;
}

// ── Step 5: Installer ─────────────────────────────────────────
function renderStepInstaller() {
  const base = getBase();
  const avail = base ? base.installers : ['none'];
  let html = `<h2 class="step-heading">Step 5 — Installer</h2>
    <p class="step-sub">Choose a graphical installer to include, or <em>None</em> for a live-only / image-write build.</p>
    <div class="tiles single-col" role="radiogroup" aria-label="Installer">`;
  for (const ins of avail) {
    const sel = state.installer === ins ? 'selected' : '';
    html += `<div class="tile ${sel}" data-installer="${esc(ins)}" role="radio" tabindex="0" aria-checked="${sel === 'selected'}">
      <div class="tile-title">${esc(ins.charAt(0).toUpperCase() + ins.slice(1))}</div>
      <div class="installer-desc">${esc(INSTALLER_DESC[ins] || ins)}</div>
    </div>`;
  }
  html += '</div>';
  return html;
}

// ── Step 6: Services ─────────────────────────────────────────
function renderStepServices() {
  const base = getBase();
  const avail = base
    ? SERVICES.filter(s => s.families === null || s.families.includes(base.family))
    : SERVICES.filter(s => s.families === null);

  const baseServices  = avail.filter(s => !['rpi-eeprom-update','raspi-config-svc','rpi-connect-svc','pigpiod'].includes(s.id));
  const rpiServices   = avail.filter(s =>  ['rpi-eeprom-update','raspi-config-svc','rpi-connect-svc','pigpiod'].includes(s.id));

  let html = `<h2 class="step-heading">Step 6 — Services</h2>
    <p class="step-sub">Toggle systemd units to enable on first boot.</p>
    <div class="toggle-list">`;

  for (const svc of baseServices) {
    html += renderToggleRow(svc, state.services);
  }

  if (rpiServices.length) {
    html += `<div class="toggle-section-header">Raspberry Pi Services</div>`;
    for (const svc of rpiServices) {
      html += renderToggleRow(svc, state.services);
    }
  }

  html += '</div>';

  // RPi config.txt panel
  if (isRpiFamily()) {
    const hwArch = state.rpiHardware
      ? (RPI_HARDWARE.find(h => h.id === state.rpiHardware) || {}).arch || 'aarch64'
      : 'aarch64';
    const armhf = hwArch === 'armhf';

    html += `<div class="config-panel">
      <h4>⚙️ /boot/firmware/config.txt flags</h4>`;

    for (const flag of RPI_CONFIG_FLAGS) {
      if (flag.id === 'arm_64bit' && armhf) continue; // armhf can't use 64-bit
      const val = state.configTxt[flag.id] !== undefined ? state.configTxt[flag.id] : flag.default;
      if (flag.type === 'bool') {
        html += `<div class="config-row">
          <label>${esc(flag.label)}</label>
          <input type="checkbox" data-config="${esc(flag.id)}" ${val ? 'checked' : ''} />
        </div>`;
      } else if (flag.type === 'range') {
        const numVal = typeof val === 'number' ? val : flag.default;
        html += `<div class="config-row">
          <label>${esc(flag.label)}</label>
          <input type="range" data-config-range="${esc(flag.id)}" min="${flag.min}" max="${flag.max}" step="${flag.step}" value="${numVal}" />
          <span class="config-val" id="cfg-val-${esc(flag.id)}">${numVal} MB</span>
        </div>`;
      }
    }
    html += '</div>';
  }
  return html;
}

function renderToggleRow(svc, stateMap) {
  const on = stateMap[svc.id] !== undefined ? stateMap[svc.id] : svc.defaultOn;
  const cls = on ? 'on' : '';
  return `<div class="toggle-row ${cls}" data-service="${esc(svc.id)}" role="checkbox" tabindex="0" aria-checked="${on}">
    <div class="toggle-label">
      <strong>${esc(svc.label)}</strong>
      <span>${esc(svc.unit)} — ${esc(svc.desc)}</span>
    </div>
    <div class="toggle-switch"></div>
  </div>`;
}

// ── Step 7: Summary ───────────────────────────────────────────
function renderStepSummary() {
  const base = getBase();
  const steps = getSteps();

  const enabledPkgs = Object.entries(state.pkgs)
    .filter(([,v]) => v)
    .map(([k]) => PACKAGES.find(p => p.id === k))
    .filter(Boolean)
    .map(p => getPkgName(p))
    .join(', ') || '(none)';

  const enabledSvcs = Object.entries(state.services)
    .filter(([,v]) => v)
    .map(([k]) => SERVICES.find(s => s.id === k))
    .filter(Boolean)
    .map(s => s.label)
    .join(', ') || '(none)';

  const repoDisplay = state.repoType === 'custom'
    ? `custom (${state.customMirrorUrl || 'no URL set'})`
    : state.repoType === 'ppa'
    ? `official + PPA`
    : (state.repoType || '—');

  const hwLabel = state.rpiHardware
    ? (RPI_HARDWARE.find(h => h.id === state.rpiHardware) || {}).label || state.rpiHardware
    : null;

  function editLink(stepId) {
    return `<span class="edit-link" data-jump="${esc(stepId)}">Edit</span>`;
  }

  let rows = `
    <tr><td>Base ${editLink('base')}</td><td>${base ? esc(base.label) : '—'}</td></tr>`;
  if (isRpiFamily() && hwLabel) {
    rows += `<tr><td>Hardware ${editLink('rpi-hw')}</td><td>${esc(hwLabel)}</td></tr>`;
  }
  rows += `
    <tr><td>Desktop ${editLink('de')}</td><td>${state.de ? esc(DE_LABELS[state.de] || state.de) : '—'}</td></tr>
    <tr><td>Packages ${editLink('packages')}</td><td>${esc(enabledPkgs)}</td></tr>
    <tr><td>Repository ${editLink('repo')}</td><td>${esc(repoDisplay)}</td></tr>
    <tr><td>Installer ${editLink('installer')}</td><td>${state.installer ? esc(state.installer) : '—'}</td></tr>
    <tr><td>Services ${editLink('services')}</td><td>${esc(enabledSvcs)}</td></tr>`;

  if (isRpiFamily()) {
    const flagsOn = RPI_CONFIG_FLAGS
      .filter(f => f.type === 'bool' && state.configTxt[f.id])
      .map(f => f.label);
    const gpuMem = state.configTxt['gpu_mem'];
    const flagSummary = [
      ...flagsOn,
      `GPU mem: ${typeof gpuMem === 'number' ? gpuMem : 128} MB`,
    ].join(', ');
    rows += `<tr><td>config.txt ${editLink('services')}</td><td>${esc(flagSummary)}</td></tr>`;
  }

  const dlSafeName = safeScriptName();

  let html = `<h2 class="step-heading">Summary &amp; Download</h2>
    <p class="step-sub">Review your choices, then download the generated build script.</p>
    <table class="summary-table"><tbody>${rows}</tbody></table>
    <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <button class="btn-download" id="btn-download">⬇ Download build-${esc(dlSafeName)}.sh</button>
    </div>
    <div class="curl-cmd-wrap">
      <div class="curl-cmd-header">
        <span class="curl-cmd-title">⚡ One-liner run command</span>
        <span class="curl-cmd-hint">Paste into your terminal to download, <code>chmod +x</code>, and run in one step — no manual download needed</span>
      </div>
      <div class="curl-cmd-row">
        <input type="text" id="curl-cmd-field" class="curl-cmd-field" readonly
               placeholder="Generating command…" aria-label="One-liner run command" />
        <button class="btn-copy-cmd" id="btn-copy-cmd" aria-label="Copy run command">📋 Copy</button>
      </div>
    </div>
    <div class="info-banner">
      <p>ℹ️ If your host OS differs from the build environment, the generated script will automatically use Docker or Podman to create the correct environment. The ISO or IMG will be saved to your <code>OUTPUT_DIR</code> on the host.</p>
      <p>Requires <a href="https://docs.docker.com/engine/install/" target="_blank" rel="noopener">Docker</a> or <a href="https://podman.io/docs/installation" target="_blank" rel="noopener">Podman</a>.</p>
    </div>
    <div class="script-preview-wrap">
      <button class="preview-toggle" id="btn-preview">▶ Preview script</button>
      <div id="script-preview-content" style="display:none">
        <pre class="script-pre" id="script-pre"></pre>
      </div>
    </div>`;
  return html;
}

// ============================================================
// KEYBOARD HELPERS
// ============================================================

// Arrow/Space/Enter navigation for radio-style tiles
function attachTileKeys(tiles, onActivate) {
  tiles.forEach((el, idx) => {
    el.addEventListener('keydown', (e) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          onActivate(el);
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          tiles[(idx + 1) % tiles.length].focus();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          tiles[(idx - 1 + tiles.length) % tiles.length].focus();
          break;
      }
    });
  });
}

// Space/Enter toggle for checkbox-style rows
function attachToggleKeys(toggles, onToggle) {
  toggles.forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onToggle(el);
      }
    });
  });
}

// ============================================================
// STEP EVENT LISTENERS
// ============================================================

function attachStepListeners(stepId) {
  const container = document.getElementById('step-container');

  switch (stepId) {
    case 'base': {
      const baseTiles = [...container.querySelectorAll('[data-base]')];
      const activateBase = (el) => { onBaseSelected(el.dataset.base); };
      baseTiles.forEach(el => el.addEventListener('click', () => activateBase(el)));
      attachTileKeys(baseTiles, activateBase);

      container.querySelectorAll('[data-base-filter]').forEach(pill => {
        pill.addEventListener('click', () => {
          baseFilter = pill.dataset.baseFilter;
          renderCurrentStep();
        });
      });
      break;
    }

    case 'rpi-hw': {
      const rpiTiles = [...container.querySelectorAll('[data-rpi-hw]')];
      const activateRpiHw = (el) => {
        state.rpiHardware = el.dataset.rpiHw;
        const hw = RPI_HARDWARE.find(h => h.id === state.rpiHardware);
        if (hw && hw.arch === 'armhf') {
          state.configTxt['arm_64bit'] = false;
        }
        renderAll();
      };
      rpiTiles.forEach(el => el.addEventListener('click', () => activateRpiHw(el)));
      attachTileKeys(rpiTiles, activateRpiHw);
      break;
    }

    case 'de': {
      const deTiles = [...container.querySelectorAll('[data-de]')];

      const updateDeScreenshot = (de) => {
        const wrap = document.getElementById('de-screenshot-wrap');
        const img  = document.getElementById('de-screenshot-img');
        const cap  = document.getElementById('de-screenshot-caption');
        if (!wrap || !img || !cap) return;
        const url   = de && de !== 'none' && DE_SCREENSHOTS[de] ? DE_SCREENSHOTS[de] : '';
        const label = de ? (DE_LABELS[de] || de) : '';
        const desc  = de ? (DE_DESCRIPTIONS[de] || '') : '';
        if (url) {
          img.src = url;
          img.alt = label + ' desktop screenshot';
          cap.innerHTML = `<strong>${esc(label)}</strong>${desc ? ` — ${esc(desc)}` : ''}`;
          wrap.hidden = false;
        } else {
          wrap.hidden = true;
        }
      };

      // Hide the screenshot panel if the image fails to load
      const screenshotImg = document.getElementById('de-screenshot-img');
      if (screenshotImg) {
        screenshotImg.addEventListener('error', () => {
          const wrap = document.getElementById('de-screenshot-wrap');
          if (wrap) wrap.hidden = true;
        });
      }

      const activateDe = (el) => { state.de = el.dataset.de; renderAll(); };
      deTiles.forEach(el => {
        el.addEventListener('click',      () => activateDe(el));
        el.addEventListener('mouseenter', () => updateDeScreenshot(el.dataset.de));
        el.addEventListener('mouseleave', () => updateDeScreenshot(state.de));
        el.addEventListener('focus',      () => updateDeScreenshot(el.dataset.de));
        el.addEventListener('blur',       () => updateDeScreenshot(state.de));
      });
      attachTileKeys(deTiles, activateDe);
      break;
    }

    case 'packages': {
      const pkgToggles = [...container.querySelectorAll('[data-pkg]')];
      const togglePkg = (el) => {
        const id = el.dataset.pkg;
        state.pkgs[id] = !state.pkgs[id];
        el.classList.toggle('on', state.pkgs[id]);
        el.querySelector('.toggle-switch').style.cssText = '';
        el.setAttribute('aria-checked', state.pkgs[id]);
      };
      pkgToggles.forEach(el => el.addEventListener('click', () => togglePkg(el)));
      attachToggleKeys(pkgToggles, togglePkg);
      break;
    }

    case 'repo': {
      const repoTiles = [...container.querySelectorAll('[data-repo]')];
      const activateRepo = (el) => { state.repoType = el.dataset.repo; renderAll(); };
      repoTiles.forEach(el => el.addEventListener('click', () => activateRepo(el)));
      attachTileKeys(repoTiles, activateRepo);
      {
        const customInput = document.getElementById('custom-mirror');
        if (customInput) {
          customInput.addEventListener('input', () => {
            state.customMirrorUrl = customInput.value;
            updateNav();
          });
        }
        const ppaInput = document.getElementById('ppa-list');
        if (ppaInput) {
          ppaInput.addEventListener('input', () => {
            state.ppaList = ppaInput.value;
          });
        }
      }
      break;
    }

    case 'installer': {
      const insTiles = [...container.querySelectorAll('[data-installer]')];
      const activateIns = (el) => { state.installer = el.dataset.installer; renderAll(); };
      insTiles.forEach(el => el.addEventListener('click', () => activateIns(el)));
      attachTileKeys(insTiles, activateIns);
      break;
    }

    case 'services': {
      const svcToggles = [...container.querySelectorAll('[data-service]')];
      const toggleSvc = (el) => {
        const id = el.dataset.service;
        state.services[id] = !state.services[id];
        el.classList.toggle('on', state.services[id]);
        el.setAttribute('aria-checked', state.services[id]);
      };
      svcToggles.forEach(el => el.addEventListener('click', () => toggleSvc(el)));
      attachToggleKeys(svcToggles, toggleSvc);
      container.querySelectorAll('[data-config]').forEach(el => {
        el.addEventListener('change', () => {
          state.configTxt[el.dataset.config] = el.checked;
        });
      });
      container.querySelectorAll('[data-config-range]').forEach(el => {
        el.addEventListener('input', () => {
          const id = el.dataset.configRange;
          state.configTxt[id] = parseInt(el.value, 10);
          const valEl = document.getElementById('cfg-val-' + id);
          if (valEl) valEl.textContent = el.value + ' MB';
        });
      });
      break;
    }

    case 'summary':
      {
        const dlBtn = document.getElementById('btn-download');
        if (dlBtn) {
          dlBtn.addEventListener('click', downloadScript);
        }

        // Populate and wire the one-liner run command field
        const cmdField = document.getElementById('curl-cmd-field');
        if (cmdField) {
          cmdField.value = buildRunCommand();
        }

        const copyBtn = document.getElementById('btn-copy-cmd');
        if (copyBtn && cmdField) {
          copyBtn.addEventListener('click', () => {
            if (!cmdField.value) return;
            const doCopy = () => {
              copyBtn.textContent = '✓ Copied!';
              setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(cmdField.value).then(doCopy).catch(() => {
                cmdField.select();
                document.execCommand('copy');
                doCopy();
              });
            } else {
              cmdField.select();
              document.execCommand('copy');
              doCopy();
            }
          });
        }

        const previewBtn = document.getElementById('btn-preview');
        const previewContent = document.getElementById('script-preview-content');
        const previewPre = document.getElementById('script-pre');
        if (previewBtn) {
          previewBtn.addEventListener('click', () => {
            const open = previewContent.style.display !== 'none';
            if (open) {
              previewContent.style.display = 'none';
              previewBtn.textContent = '▶ Preview script';
            } else {
              previewContent.style.display = '';
              previewPre.textContent = generateScript();
              previewBtn.textContent = '▼ Hide script';
            }
          });
        }

        container.querySelectorAll('[data-jump]').forEach(el => {
          el.addEventListener('click', () => jumpToStep(el.dataset.jump));
        });
      }
      break;
  }
}

// ── Base selection cascade ────────────────────────────────────
function onBaseSelected(baseId) {
  const wasRpi = isRpiFamily();
  state.base = baseId;

  // Reset downstream
  state.rpiHardware = null;
  state.de = null;
  state.repoType = null;
  state.installer = null;
  state.customMirrorUrl = '';
  state.ppaList = '';

  initDefaultPkgs();
  initDefaultServices();
  if (isRpiFamily()) {
    initDefaultConfigTxt();
  }

  // If base changed to/from RPi, step list length changes → reset to step 0
  const nowRpi = isRpiFamily();
  if (wasRpi !== nowRpi) {
    // keep on base step (step 0)
    currentStepIndex = 0;
  }

  renderAll();
}

// ============================================================
// SCRIPT GENERATORS
// ============================================================

function generateScript() {
  const base = getBase();
  if (!base) return '# No base selected';
  const name = (state.distroName || 'MyDistro').replace(/[^A-Za-z0-9_-]/g, '_');

  switch (base.builder) {
    case 'live-build':  return generateLiveBuild(base, name);
    case 'archiso':     return generateArchiso(base, name);
    case 'lorax':       return generateLorax(base, name);
    case 'pi-gen':      return generatePiGen(base, name);
    case 'ubuntu-rpi':  return generateUbuntuRpi(base, name);
    case 'alarm-rpi':   return generateAlarmRpi(base, name);
    case 'kiwi':        return generateKiwi(base, name);
    default:            return `# Builder '${base.builder}' is not yet implemented`;
  }
}

// ─ Helpers used across generators ────────────────────────────

function enabledPkgList(base) {
  const resolvePkgName = (pkg) => {
    // firefox-esr is Debian-specific; Ubuntu uses firefox.
    if (pkg.id === 'firefox' && base.pkg === 'apt') {
      return base.family === 'debian' ? 'firefox-esr' : 'firefox';
    }

    // VS Code ("code") is not in Ubuntu's default apt repos.
    // Keep it for distros where the package is expected natively.
    if (pkg.id === 'vscode' && base.pkg === 'apt' && base.family === 'ubuntu') {
      return '';
    }

    return pkg.pkgName[base.pkg] || pkg.id;
  };

  return PACKAGES
    .filter(p => p.families.includes(base.family) && state.pkgs[p.id])
    .map(resolvePkgName)
    .filter(Boolean)
    .join(' ');
}

function enabledServicesList() {
  return SERVICES
    .filter(s => state.services[s.id])
    .map(s => s.unit)
    .join(' ');
}

function enabledServicePkgList(base) {
  return SERVICES
    .filter(s => state.services[s.id])
    .filter(s => s.families === null || s.families.includes(base.family))
    .map(s => (s.pkgName && s.pkgName[base.pkg]) || '')
    .filter(Boolean)
    .join(' ');
}

function dePkgs(base) {
  if (!state.de || state.de === 'none') return '';
  return (DE_PACKAGES[state.de] || {})[base.pkg] || '';
}

function autologinHook(base) {
  const dm = DE_DM[state.de || 'none'];
  if (!dm) return '';
  if (dm === 'sddm') {
    return `\n# Auto-login hook (SDDM)\nmkdir -p /etc/sddm.conf.d\ncat > /etc/sddm.conf.d/autologin.conf << 'SDDM_EOF'\n[Autologin]\nUser=user\nSession=plasma\nSDDM_EOF`;
  }
  if (dm === 'gdm') {
    return `\n# Auto-login hook (GDM)\nsed -i 's/#AutomaticLoginEnable/AutomaticLoginEnable/' /etc/gdm3/daemon.conf\nsed -i 's/#AutomaticLogin = user1/AutomaticLogin = user/' /etc/gdm3/daemon.conf`;
  }
  if (dm === 'lightdm') {
    return `\n# Auto-login hook (LightDM)\nsed -i 's/#autologin-user=/autologin-user=user/' /etc/lightdm/lightdm.conf`;
  }
  return '';
}

function serviceEnableBlock(units) {
  if (!units) return '';
  const enables = units.split(' ').filter(Boolean).map(u => `enable_if_exists "${u}"`).join('\n');
  return `enable_if_exists() {
  if systemctl list-unit-files "$1" 2>/dev/null | grep -q "^$1"; then
    systemctl enable "$1"
  else
    echo "Skipping $1 (unit not found — package may not be installed)"
  fi
}
${enables}`;
}

// ─ Docker/Podman container self-re-launch preamble ───────────
// Injected into generated scripts so they work on any host OS.
function containerPreamble(containerImage) {
  return `
# ── Container self-re-launch ──────────────────────────────────
# If this script is not already running inside a container it
# re-execs itself inside the correct build environment using
# Docker or Podman, so it works on any host OS (e.g. building a
# Debian ISO from an Arch Linux host).  The finished ISO / IMG is
# written to OUTPUT_DIR on the host via a bind-mount.
# --privileged is required for loop-device and chroot operations.
CONTAINER_IMAGE="${containerImage}"

if [ ! -f /.dockerenv ] && [ -z "\${container:-}" ]; then
  if command -v docker >/dev/null 2>&1; then
    _RUNTIME=docker
  elif command -v podman >/dev/null 2>&1; then
    _RUNTIME=podman
  else
    die "Docker or Podman is required to build on a non-native host. Install Docker: https://docs.docker.com/engine/install/ -- or Podman: https://podman.io/docs/installation"
  fi
  _SCRIPT_SOURCE="\${BASH_SOURCE[0]:-\$0}"
  if [[ "\${_SCRIPT_SOURCE}" != */* ]]; then
    _SCRIPT_SOURCE="\$(command -v -- "\${_SCRIPT_SOURCE}" || true)"
  fi
  [ -n "\${_SCRIPT_SOURCE}" ] || die "Unable to resolve script path for container re-exec"
  _SCRIPT_PATH="\$(realpath "\${_SCRIPT_SOURCE}")" || die "Unable to canonicalize script path: \${_SCRIPT_SOURCE}"
  log "Re-launching inside \${CONTAINER_IMAGE} via \${_RUNTIME}..."
  mkdir -p "\${OUTPUT_DIR}"
  exec "\${_RUNTIME}" run --rm --privileged \\
    -v "\$(realpath "\${OUTPUT_DIR}"):/out" \\
    -v "\${_SCRIPT_PATH}:/build.sh:ro" \\
    -e BUILD_DIR=/var/tmp/distro-build \\
    -e OUTPUT_DIR=/out \\
    -e HOST_OUTPUT_DIR="\$(realpath "\${OUTPUT_DIR}")" \\
    "\${CONTAINER_IMAGE}" bash /build.sh
fi
`;
}

function scriptHeader(name, builder, containerImage) {
  return `#!/usr/bin/env bash
# ============================================================
# ${name} — build-distro.sh
# Generated by https://fugginold.github.io/OSDB/
# Builder: ${builder}
# ============================================================
set -euo pipefail

DISTRO_NAME="${name}"
BUILD_DIR="\${BUILD_DIR:-/var/tmp/distro-build}"
OUTPUT_DIR="\${OUTPUT_DIR:-/tmp/distro-output}"
HOST_OUTPUT_DIR="\${HOST_OUTPUT_DIR:-}"
LOG_FILE="\${OUTPUT_DIR}/build.log"
DISPLAY_OUTPUT_DIR=""
DISPLAY_LOG_FILE=""
CLEANUP_ON_FAILURE="\${CLEANUP_ON_FAILURE:-true}"
BUILD_MARKER="\${BUILD_DIR}/.osdb-build-workspace"
SCRIPT_START_DIR="\$(pwd -P)"

log() { printf '\\033[1;34m[%s]\\033[0m %s\\n' "\$(date +%T)" "\$*"; }
die() { printf '\\033[1;31m[ERROR]\\033[0m %s\\n' "\$*" >&2; exit 1; }
cleanup_build_dir() {
  case "\${CLEANUP_ON_FAILURE}" in
    1|true|TRUE|yes|YES) ;;
    *) log "Leaving build directory in place because CLEANUP_ON_FAILURE=\${CLEANUP_ON_FAILURE}"; return 0 ;;
  esac

  if [ ! -f "\${BUILD_MARKER}" ]; then
    log "Skipping cleanup; build marker not found in \${BUILD_DIR}"
    return 0
  fi

  local cleanup_path output_path
  cleanup_path="\$(cd "\$(dirname "\${BUILD_DIR}")" && pwd -P)/\$(basename "\${BUILD_DIR}")" || return 0
  output_path="\$(cd "\$(dirname "\${OUTPUT_DIR}")" && pwd -P)/\$(basename "\${OUTPUT_DIR}")" || output_path="\${OUTPUT_DIR}"

  case "\${cleanup_path}" in
    /|/tmp|/var|/var/tmp|/home|"\${HOME:-}") log "Refusing to clean unsafe BUILD_DIR: \${cleanup_path}"; return 0 ;;
  esac
  if [ "\${cleanup_path}" = "\${SCRIPT_START_DIR}" ]; then
    log "Refusing to clean BUILD_DIR because it is the launch directory: \${cleanup_path}"
    return 0
  fi
  case "\${output_path}" in
    "\${cleanup_path}"|"\${cleanup_path}"/*) log "Refusing to clean BUILD_DIR because it contains OUTPUT_DIR: \${output_path}"; return 0 ;;
  esac

  log "Removing failed build workspace: \${cleanup_path}"
  rm -rf --one-file-system -- "\${cleanup_path}"
}
finish_build() {
  local status=$?
  if [ "\${status}" -ne 0 ]; then
    log "Build failed with exit code \${status}. See \${DISPLAY_LOG_FILE}"
    cleanup_build_dir
  else
    log "Build log saved to \${DISPLAY_LOG_FILE}"
  fi
}
start_logging() {
  mkdir -p "\${OUTPUT_DIR}"
  : > "\${LOG_FILE}"
  exec > >(tee -a "\${LOG_FILE}") 2>&1
  log "Logging to \${DISPLAY_LOG_FILE}"
  log "Build directory: \${BUILD_DIR}"
  log "Output directory: \${DISPLAY_OUTPUT_DIR}"
  log "Cleanup on failure: \${CLEANUP_ON_FAILURE}"
  trap finish_build EXIT
}
${containerImage ? containerPreamble(containerImage) : ''}
if [ "\${EUID:-\$(id -u)}" -ne 0 ]; then
  die "This script must be run as root. Re-run with: sudo \$0"
fi

mkdir -p "\${BUILD_DIR}" "\${OUTPUT_DIR}"
BUILD_DIR="\$(cd "\${BUILD_DIR}" && pwd -P)"
OUTPUT_DIR="\$(cd "\${OUTPUT_DIR}" && pwd -P)"
LOG_FILE="\${OUTPUT_DIR}/build.log"
if [ -n "\${HOST_OUTPUT_DIR}" ]; then
  DISPLAY_OUTPUT_DIR="\${HOST_OUTPUT_DIR}"
else
  DISPLAY_OUTPUT_DIR="\${OUTPUT_DIR}"
fi
DISPLAY_LOG_FILE="\${DISPLAY_OUTPUT_DIR}/build.log"
BUILD_MARKER="\${BUILD_DIR}/.osdb-build-workspace"
: > "\${BUILD_MARKER}"
start_logging
`;
}

// ─ live-build (Debian / Ubuntu) ──────────────────────────────
function generateLiveBuild(base, name) {
  const de = state.de || 'none';
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const allPkgs = [dePackages, userPkgs].filter(Boolean).join(' ');
  const mirror = (state.repoType === 'custom' && state.customMirrorUrl.trim())
    ? state.customMirrorUrl.trim() : base.mirror;
  const areas = base.areas;
  const suite = base.suite;
  const services = enabledServicesList();
  const containerImage = base.family === 'ubuntu' ? `ubuntu:${suite}` : `debian:${suite}`;
  const ubuntuMirrorArgs = base.family === 'ubuntu'
    ? `  --mode ubuntu \\
  --parent-mirror-bootstrap "${mirror}" \\
  --parent-mirror-chroot "${mirror}" \\
  --parent-mirror-binary "${mirror}" \\
  --parent-mirror-chroot-security "http://security.ubuntu.com/ubuntu" \\
  --parent-mirror-binary-security "http://security.ubuntu.com/ubuntu" \\
  --mirror-chroot-security "http://security.ubuntu.com/ubuntu" \\
  --mirror-binary-security "http://security.ubuntu.com/ubuntu" \\
`
    : '';

  const calamaresBlock = state.installer === 'calamares' ? `
# ── Calamares installer config ────────────────────────────────
log "Writing Calamares configuration..."
CALA_DIR="\${LB_DIR}/config/includes.chroot/etc/calamares"
mkdir -p "\${CALA_DIR}/branding/\${DISTRO_NAME}" "\${CALA_DIR}/modules"

cat > "\${CALA_DIR}/settings.conf" << 'CALA_EOF'
---
modules-search: [ local, /usr/lib/calamares/modules ]
sequence:
  - show: [ welcome, locale, keyboard, partition, users, summary ]
  - exec:  [ partition, mount, unpackfs, machineid, fstab, locale,
             keyboard, localecfg, users, networkcfg, hwclock,
             services-systemd, grubcfg, bootloader, packages,
             removeuser, umount ]
  - show: [ finished ]
branding: ${name}
prompt-install: false
dont-chroot: false
CALA_EOF

cat > "\${CALA_DIR}/branding/\${DISTRO_NAME}/branding.desc" << 'BRAND_EOF'
---
componentName: ${name}
strings:
  productName: ${name}
  shortProductName: ${name}
  version: "1.0"
  versionedName: "${name} 1.0"
  bootloaderEntryName: ${name}
  productUrl: "https://example.com"
  supportUrl: "https://example.com/support"
  knownIssuesUrl: "https://example.com/known-issues"
  releaseNotesUrl: "https://example.com/release-notes"
images:
  productLogo: "logo.png"
  productIcon: "logo.png"
  productWelcome: "languages.png"
BRAND_EOF

cat > "\${CALA_DIR}/modules/users.conf" << 'USERS_EOF'
---
defaultGroups: [ users, lp, video, audio, cdrom, plugdev, netdev ]
autologinGroup: autologin
sudoersGroup: sudo
setRootPassword: false
USERS_EOF

cat > "\${CALA_DIR}/modules/services-systemd.conf" << 'SVC_EOF'
---
units:
${services.split(' ').filter(Boolean).flatMap(u => [`  - name: "${u}"`, `    mandatory: false`]).join('\n')}
SVC_EOF
` : '';

  const ubiquityNote = state.installer === 'ubiquity'
    ? '\n# NOTE: Ubiquity requires the ubiquity package included below (added automatically)\n'
    : '';

  const ppaBlock = state.repoType === 'ppa' && state.ppaList.trim()
    ? state.ppaList.trim().split('\n').filter(Boolean).map(ppa =>
        `add-apt-repository -y "${ppa.trim()}"`
      ).join('\n') + '\napt-get update'
    : '';

  return `${scriptHeader(name, 'live-build', containerImage)}
LB_DIR="\${BUILD_DIR}/lb"
ensure_live_build_workdir() {
  local path="$1"
  local mount_opts

  mkdir -p "\${path}"
  if ! command -v findmnt >/dev/null 2>&1; then
    return 0
  fi

  mount_opts="\$(findmnt -T "\${path}" -no OPTIONS 2>/dev/null || true)"
  case ",\${mount_opts}," in
    *,nodev,*|*,noexec,*)
      die "BUILD_DIR '\${path}' is on a filesystem mounted with \${mount_opts}. live-build/debootstrap needs device nodes and executable scripts. Re-run with BUILD_DIR=/var/tmp/distro-build or another path on a dev,exec filesystem."
      ;;
  esac
}

ensure_live_build_workdir "\${BUILD_DIR}"
${ubiquityNote}
# ── Prerequisites ─────────────────────────────────────────────
log "Installing live-build..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y live-build curl ca-certificates xz-utils
DEBIAN_FRONTEND=noninteractive apt-get install -y syslinux-utils || DEBIAN_FRONTEND=noninteractive apt-get install -y syslinux isolinux

if ! command -v isohybrid >/dev/null 2>&1; then
  for cand in /usr/lib/ISOLINUX/isohybrid /usr/lib/syslinux/isohybrid; do
    if [ -x "$cand" ]; then
      ln -sf "$cand" /usr/local/bin/isohybrid
      break
    fi
  done
fi

if ! command -v isohybrid >/dev/null 2>&1; then
  die "isohybrid is required for iso-hybrid output but is not installed. Install syslinux-utils (or syslinux/isolinux) in the build container."
fi

mkdir -p "\${LB_DIR}"
cd "\${LB_DIR}"

# ── lb config ─────────────────────────────────────────────────
log "Configuring live-build..."
lb config \\
  --distribution "${suite}" \\
  --archive-areas "${areas}" \\
  --mirror-bootstrap "${mirror}" \\
  --mirror-binary "${mirror}" \\
${ubuntuMirrorArgs}  --mirror-chroot "${mirror}" \\
  --binary-images iso \\
  --bootloader "grub-efi,syslinux" \\
  --debian-installer false \\
  --apt-recommends false \\
  --memtest none

# ── Chroot environment ──────────────────────────────────────────────
log "Setting noninteractive environment for chroot..."
mkdir -p config
printf '%s\\n' \\
  'DEBIAN_FRONTEND=noninteractive' \\
  'DEBCONF_NONINTERACTIVE_SEEN=true' > config/environment.chroot

# ── Debconf preseed ──────────────────────────────────────────────
log "Writing debconf preseed..."
mkdir -p config/preseed
cat > config/preseed/live.cfg.chroot << 'PRESEED_EOF'
console-setup console-setup/charmap47 select UTF-8
console-setup console-setup/codeset47 select Guess optimal character set
console-setup console-setup/fontface47 select Fixed
console-setup console-setup/fontsize-fb47 select 8x16
console-setup console-setup/store_defaults_in_debconf_db boolean true
keyboard-configuration keyboard-configuration/modelcode string pc105
keyboard-configuration keyboard-configuration/layout select English (US)
keyboard-configuration keyboard-configuration/layoutcode string us
keyboard-configuration keyboard-configuration/variant select
keyboard-configuration keyboard-configuration/variantcode string
keyboard-configuration keyboard-configuration/xkb-keymap select us
PRESEED_EOF

# ── Package lists ──────────────────────────────────────────────
log "Writing package lists..."
mkdir -p config/package-lists
${dePackages ? `printf '%s\\n' ${dePackages.split(' ').map(p => `"${p}"`).join(' ')} > config/package-lists/desktop.list.chroot` : '# No desktop packages (headless)'}
${userPkgs ? `printf '%s\\n' ${userPkgs.split(' ').map(p => `"${p}"`).join(' ')} > config/package-lists/user.list.chroot` : '# No extra user packages selected'}
${servicePkgs ? `printf '%s\\n' ${servicePkgs.split(' ').map(p => `"${p}"`).join(' ')} > config/package-lists/services.list.chroot` : '# No extra service packages needed'}
printf '%s\\n' "live-boot" "live-config" "live-config-systemd" > config/package-lists/live.list.chroot
${state.installer === 'calamares' ? 'printf \'%s\\n\' "calamares" "calamares-settings-debian" > config/package-lists/installer.list.chroot' : ''}
${state.installer === 'ubiquity'  ? 'printf \'%s\\n\' "ubiquity" "ubiquity-frontend-gtk" > config/package-lists/installer.list.chroot' : ''}

# ── Chroot hooks ───────────────────────────────────────────────
log "Writing chroot hooks..."
mkdir -p config/hooks/live

# ── PPAs ──────────────────────────────────────────────────────
${ppaBlock ? `log "Adding PPAs..."
cat > config/hooks/live/0001-ppa.hook.chroot << 'HOOK_EOF'
#!/bin/sh
set -e
apt-get install -y software-properties-common
${ppaBlock}
HOOK_EOF
chmod +x config/hooks/live/0001-ppa.hook.chroot` : '# No PPAs configured'}

# Hook: enable services
cat > config/hooks/live/0010-services.hook.chroot << 'HOOK_EOF'
#!/bin/sh
set -e
${serviceEnableBlock(services) || '# No services selected'}
HOOK_EOF
chmod +x config/hooks/live/0010-services.hook.chroot

# Hook: display manager / auto-login
cat > config/hooks/live/0020-autologin.hook.chroot << 'HOOK_EOF'
#!/bin/sh
set -e
${autologinHook(base)}
HOOK_EOF
chmod +x config/hooks/live/0020-autologin.hook.chroot

${calamaresBlock}

# ── Build ──────────────────────────────────────────────────────
log "Starting live-build (this may take 30–60 minutes)..."
lb build

# ── Move output ────────────────────────────────────────────────
find . -maxdepth 1 -name '*.iso' -exec mv {} "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso" \\;

# ── Checksum ───────────────────────────────────────────────────
log "Generating SHA256 checksum..."
sha256sum "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso" > "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"

log "Build complete!"
log "ISO:      \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso"
log "Checksum: \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"
`;
}

// ─ archiso (Arch Linux) ───────────────────────────────────────
function generateArchiso(base, name) {
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const allPkgs = [dePackages, userPkgs, servicePkgs, 'base linux linux-firmware'].filter(Boolean).join(' ');
  const services = enabledServicesList();
  const containerImage = 'archlinux:latest';

  const arInstallBlock = state.installer === 'archinstall'
    ? '\n# archinstall is included in the live environment by default\n'
    : '';

  const calamaresBlock = state.installer === 'calamares' ? `

# ── Calamares for Arch ─────────────────────────────────────────
log "Adding calamares to package list..."
echo "calamares" >> "\${PROFILE_DIR}/packages.x86_64"
mkdir -p "\${PROFILE_DIR}/airootfs/etc/calamares"
cat > "\${PROFILE_DIR}/airootfs/etc/calamares/settings.conf" << 'CALA_EOF'
---
modules-search: [ local, /usr/lib/calamares/modules ]
sequence:
  - show: [ welcome, locale, keyboard, partition, users, summary ]
  - exec:  [ partition, mount, unpackfs, machineid, fstab, locale,
             keyboard, localecfg, users, networkcfg, hwclock,
             services-systemd, grubcfg, bootloader, umount ]
  - show: [ finished ]
branding: ${name}
CALA_EOF
` : '';

  return `${scriptHeader(name, 'archiso', containerImage)}
PROFILE_DIR="\${BUILD_DIR}/profile"
WORK_DIR="\${BUILD_DIR}/work"

# ── Prerequisites ─────────────────────────────────────────────
log "Installing archiso..."
pacman -Syu --noconfirm archiso ${state.installer === 'calamares' ? 'calamares' : ''}

# ── Copy baseline profile ──────────────────────────────────────
log "Setting up archiso profile..."
cp -r /usr/share/archiso/configs/releng "\${PROFILE_DIR}"
cd "\${PROFILE_DIR}"

# ── Package list ──────────────────────────────────────────────
log "Writing package list..."
cat > packages.x86_64 << 'PKGS_EOF'
${allPkgs.split(' ').filter(Boolean).join('\n')}
PKGS_EOF
${arInstallBlock}${calamaresBlock}

# ── Airootfs overlay ───────────────────────────────────────────
log "Writing airootfs overlay..."
mkdir -p airootfs/etc/systemd/system/multi-user.target.wants
${services.split(' ').filter(Boolean).map(u =>
  `ln -sf "/usr/lib/systemd/system/${u}" "airootfs/etc/systemd/system/multi-user.target.wants/${u}"`
).join('\n')}

# ── Autologin ─────────────────────────────────────────────────
${autologinHook(base)
  ? `mkdir -p airootfs/root
if [ -f airootfs/root/customize_airootfs.sh ]; then
  cat >> airootfs/root/customize_airootfs.sh << 'AUTO_EOF'

# Configure display manager autologin
${autologinHook(base)}
AUTO_EOF
else
  cat > airootfs/root/customize_airootfs.sh << 'AUTO_EOF'
#!/bin/sh

# Configure display manager autologin
${autologinHook(base)}
AUTO_EOF
fi
chmod +x airootfs/root/customize_airootfs.sh`
  : '# No display manager autologin needed'}

# ── Custom mirror ──────────────────────────────────────────────
${(state.repoType === 'custom' && state.customMirrorUrl.trim()) ? `cat > airootfs/etc/pacman.d/mirrorlist << 'MIRROR_EOF'
Server = ${state.customMirrorUrl.trim()}
MIRROR_EOF` : '# Using default Arch mirrors'}

# ── Build ──────────────────────────────────────────────────────
log "Building Arch ISO (this may take 20–40 minutes)..."
mkarchiso -v -w "\${WORK_DIR}" -o "\${OUTPUT_DIR}" "\${PROFILE_DIR}"

# ── Checksum ───────────────────────────────────────────────────
log "Generating SHA256 checksum..."
find "\${OUTPUT_DIR}" -name '*.iso' -exec sha256sum {} \\; > "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"
BUILT_ISO=\$(find "\${OUTPUT_DIR}" -maxdepth 1 -name '*.iso' | head -1)

log "Build complete!"
log "ISO:      \${BUILT_ISO}"
log "Checksum: \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"
`;
}

// ─ lorax (Fedora) ─────────────────────────────────────────────
function generateLorax(base, name) {
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const services = enabledServicesList();
  const suite = base.suite; // f40, f41 …
  const version = suite.replace('f', '');
  const containerImage = `fedora:${version}`;

  const ksGroups = state.de && state.de !== 'none'
    ? `@${state.de}-desktop-environment`
    : '';

  return `${scriptHeader(name, 'lorax', containerImage)}
LORAX_OUT="\${OUTPUT_DIR}/lorax"
KS_FILE="\${BUILD_DIR}/\${DISTRO_NAME}.ks"
FEDORA_VERSION="${version}"

# ── Prerequisites ─────────────────────────────────────────────
log "Installing lorax and livecd-tools..."
dnf install -y lorax livecd-tools pykickstart

# ── User password (required) ──────────────────────────────────
# Set LORAX_USER_PASSWORD before running to define the default user password.
: "\${LORAX_USER_PASSWORD:?Set LORAX_USER_PASSWORD to the desired default user password before running this script.}"
USER_PASSWORD_HASH=\$(openssl passwd -6 "\${LORAX_USER_PASSWORD}")

# ── Kickstart file ─────────────────────────────────────────────
log "Writing kickstart file..."
cat > "\${KS_FILE}" << KS_EOF
# ${name} Kickstart
text
lang en_US.UTF-8
keyboard us
timezone America/New_York
rootpw --lock
user --name=user --iscrypted --password="\${USER_PASSWORD_HASH}" --groups=wheel

bootloader --location=mbr
zerombr
clearpart --all --initlabel
autopart

%packages
@core
${ksGroups}
${dePackages.split(' ').filter(Boolean).join('\n')}
${userPkgs.split(' ').filter(Boolean).join('\n')}
${servicePkgs.split(' ').filter(Boolean).join('\n')}
%end

%services
${services.split(' ').filter(Boolean).map(u => `enabled: ${u}`).join('\n')}
%end

%post
# Custom post-install script
${serviceEnableBlock(services)}
%end
KS_EOF

# ── Build ──────────────────────────────────────────────────────
log "Running lorax (this may take 30–60 minutes)..."
mkdir -p "\${LORAX_OUT}"
lorax \\
  --product "${name}" \\
  --version "\${FEDORA_VERSION}" \\
  --release 1 \\
  --source "https://dl.fedoraproject.org/pub/fedora/linux/releases/\${FEDORA_VERSION}/Everything/x86_64/os/" \\
  "\${LORAX_OUT}"

# ── Live CD from kickstart ─────────────────────────────────────
log "Building live ISO..."
livecd-creator \\
  --config="\${KS_FILE}" \\
  --fslabel="\${DISTRO_NAME}" \\
  --title="\${DISTRO_NAME}" \\
  --product="\${DISTRO_NAME}" \\
  -d -v --cache="\${BUILD_DIR}/cache"

# ── Checksum ───────────────────────────────────────────────────
log "Generating checksum..."
find . -maxdepth 1 -name '*.iso' -exec mv {} "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso" \\;
sha256sum "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso" > "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"

log "Build complete!"
log "ISO:      \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso"
log "Checksum: \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"
`;
}

// ─ pi-gen (Raspberry Pi OS) ───────────────────────────────────
function generatePiGen(base, name) {
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const services = enabledServicesList();
  const tier = base.piGenTier || 'lite';
  const hw = state.rpiHardware || 'rpi4';
  const hwObj = RPI_HARDWARE.find(h => h.id === hw) || { arch: 'aarch64' };
  const is64 = hwObj.arch === 'aarch64';
  const sshEnabled = state.services['sshd'] ? '1' : '0';
  const containerImage = 'debian:bookworm';

  const configTxtLines = buildConfigTxt(is64);

  const skipStages = tier === 'lite'
    ? 'touch ./stage3/SKIP ./stage4/SKIP ./stage5/SKIP\ntouch ./stage4/SKIP_IMAGES ./stage5/SKIP_IMAGES'
    : tier === 'desktop'
    ? 'touch ./stage5/SKIP\ntouch ./stage5/SKIP_IMAGES'
    : '# No stages skipped (full build)';

  return `${scriptHeader(name, 'pi-gen', containerImage)}
PIGEN_DIR="\${BUILD_DIR}/pi-gen"

# ── Prerequisites ─────────────────────────────────────────────
log "Installing pi-gen dependencies..."
apt-get update -qq
apt-get install -y coreutils quilt parted qemu-user-static debootstrap zerofree \\
  zip dosfstools libarchive-tools libcap2-bin grep rsync xz-utils file git \\
  curl bc gpg

# ── Clone pi-gen ──────────────────────────────────────────────
log "Cloning pi-gen..."
if [ -d "\${PIGEN_DIR}" ]; then
  git -C "\${PIGEN_DIR}" pull
else
  git clone https://github.com/RPi-Distro/pi-gen.git "\${PIGEN_DIR}"
fi
cd "\${PIGEN_DIR}"

# ── User password ─────────────────────────────────────────────
# Set PIGEN_USER_PASS env var before running, or it defaults to "raspberry".
# WARNING: the default password is insecure — change it for production images.
: "\${PIGEN_USER_PASS:=raspberry}"

# ── Main config ───────────────────────────────────────────────
log "Writing pi-gen config..."
cat > config << CONFIG_EOF
IMG_NAME="${name}"
RELEASE="${base.suite}"
LOCALE_DEFAULT="en_US.UTF-8"
KEYBOARD_KEYMAP="us"
KEYBOARD_LAYOUT="English (US)"
TIMEZONE_DEFAULT="America/New_York"
FIRST_USER_NAME="pi"
FIRST_USER_PASS="\${PIGEN_USER_PASS}"
ENABLE_SSH=${sshEnabled}
STAGE_LIST="stage0 stage1 stage2 stage-custom"
CONFIG_EOF

# ── Skip stages not needed ────────────────────────────────────
${skipStages}

# ── Custom stage: packages ────────────────────────────────────
log "Writing custom stage..."
mkdir -p stage-custom/01-packages
EXTRA_PKGS="${[dePackages, userPkgs, servicePkgs].filter(Boolean).join(' ')}"
printf '%s' "\${EXTRA_PKGS}" > stage-custom/01-packages/packages

# ── Custom stage: services + config.txt ──────────────────────
mkdir -p stage-custom/03-run
cat > stage-custom/03-run/01-run.sh << 'RUN_EOF'
#!/bin/bash
on_chroot << 'CHROOT'
set -e

# Enable services
${serviceEnableBlock(services) || '# No services configured'}

# config.txt flags
CONFIG_TXT="/boot/firmware/config.txt"
[ -f "\${CONFIG_TXT}" ] || CONFIG_TXT="/boot/config.txt"
${configTxtLines}
CHROOT
RUN_EOF
chmod +x stage-custom/03-run/01-run.sh

# ── Build ──────────────────────────────────────────────────────
log "Starting pi-gen build (this may take 30–90 minutes)..."
sudo ./build.sh

# ── Copy output ────────────────────────────────────────────────
LATEST_XZ=\$(find deploy -name '*.img.xz' | head -1)
LATEST_IMG=\$(find deploy -name '*.img' -not -name '*.img.xz' | head -1)
[ -n "\${LATEST_XZ}"  ] && cp "\${LATEST_XZ}"  "\${OUTPUT_DIR}/\${DISTRO_NAME}.img.xz" || true
[ -n "\${LATEST_IMG}" ] && cp "\${LATEST_IMG}" "\${OUTPUT_DIR}/\${DISTRO_NAME}.img"    || true

log "Build complete!"
log "Image:    \${OUTPUT_DIR}/\${DISTRO_NAME}.img.xz"
log ""
log "# Flash to SD card (replace /dev/sdX with your device):"
log "# xzcat \${OUTPUT_DIR}/\${DISTRO_NAME}.img.xz | sudo dd of=/dev/sdX bs=4M status=progress conv=fsync"
`;
}

function buildConfigTxt(is64) {
  const lines = [];
  for (const f of RPI_CONFIG_FLAGS) {
    const val = state.configTxt[f.id] !== undefined ? state.configTxt[f.id] : f.default;
    if (f.id === 'arm_64bit' && !is64) continue;
    if (f.type === 'bool') {
      if (val) {
        lines.push(`echo "${f.line}" >> "\${CONFIG_TXT}"`);
      }
    } else if (f.type === 'range') {
      lines.push(`echo "gpu_mem=${typeof val === 'number' ? val : f.default}" >> "\${CONFIG_TXT}"`);
    }
  }
  return lines.join('\n');
}

// ─ ubuntu-rpi (Ubuntu for Raspberry Pi) ──────────────────────
function generateUbuntuRpi(base, name) {
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const services = enabledServicesList();
  const hw = state.rpiHardware || 'rpi4';
  const hwObj = RPI_HARDWARE.find(h => h.id === hw) || { arch: 'aarch64' };
  const arch = hwObj.arch;
  const suite = base.suite;
  const mirror = (state.repoType === 'custom' && state.customMirrorUrl.trim())
    ? state.customMirrorUrl.trim() : base.mirror;
  const areas = base.areas;
  const needsEeprom = ['rpi4','rpi5'].includes(hw);
  const containerImage = `ubuntu:${suite}`;

  const configTxtLines = buildConfigTxt(arch === 'aarch64');

  return `${scriptHeader(name, 'ubuntu-rpi', containerImage)}
ROOTFS="\${BUILD_DIR}/rootfs"
IMG_SIZE="8G"
IMG_FILE="\${OUTPUT_DIR}/\${DISTRO_NAME}.img"

# ── Prerequisites ─────────────────────────────────────────────
log "Installing build dependencies..."
apt-get update -qq
apt-get install -y debootstrap qemu-user-static binfmt-support parted \\
  dosfstools kpartx losetup rsync curl

# ── Create image file ─────────────────────────────────────────
log "Creating \${IMG_SIZE} image file..."
truncate -s "\${IMG_SIZE}" "\${IMG_FILE}"

# Partition: FAT32 boot (256 MB) + ext4 root
parted -s "\${IMG_FILE}" mklabel msdos
parted -s "\${IMG_FILE}" mkpart primary fat32 1MiB 257MiB
parted -s "\${IMG_FILE}" set 1 boot on
parted -s "\${IMG_FILE}" mkpart primary ext4 257MiB 100%

# Loop device
LOOP_DEV=\$(losetup --show -fP "\${IMG_FILE}")
mkfs.vfat -F32 "\${LOOP_DEV}p1"
mkfs.ext4 -F "\${LOOP_DEV}p2"

# Mount
mkdir -p "\${ROOTFS}"
mount "\${LOOP_DEV}p2" "\${ROOTFS}"
mkdir -p "\${ROOTFS}/boot/firmware"
mount "\${LOOP_DEV}p1" "\${ROOTFS}/boot/firmware"

# ── debootstrap stage 1 ───────────────────────────────────────
log "Running debootstrap stage 1..."
debootstrap --arch="${arch}" --foreign --include=ca-certificates \\
  "${suite}" "\${ROOTFS}" "${mirror}"

# ── Copy QEMU for cross-arch ──────────────────────────────────
cp /usr/bin/qemu-aarch64-static "\${ROOTFS}/usr/bin/" 2>/dev/null || true

# ── debootstrap stage 2 ───────────────────────────────────────
log "Running debootstrap stage 2 (inside chroot)..."
chroot "\${ROOTFS}" /debootstrap/debootstrap --second-stage

# ── APT sources ───────────────────────────────────────────────
log "Configuring APT sources..."
cat > "\${ROOTFS}/etc/apt/sources.list" << 'SOURCES_EOF'
deb ${mirror} ${suite} ${areas}
deb ${mirror} ${suite}-updates ${areas}
deb ${mirror} ${suite}-security ${areas}
SOURCES_EOF

# ── Install core packages ─────────────────────────────────────
log "Installing core packages..."
chroot "\${ROOTFS}" apt-get update -qq
chroot "\${ROOTFS}" apt-get install -y \\
  linux-raspi raspi-firmware u-boot-rpi flash-kernel \\
  systemd-sysv sudo adduser locales \\
  ${needsEeprom ? 'rpi-eeprom' : ''} \\
  ${dePackages} ${userPkgs} ${servicePkgs}

# ── config.txt ────────────────────────────────────────────────
log "Writing /boot/firmware/config.txt..."
${configTxtLines}

# ── Enable services ───────────────────────────────────────────
log "Enabling systemd services..."
cat > "\${ROOTFS}/tmp/enable-services.sh" << 'SVC_SCRIPT_EOF'
#!/bin/sh
set -e
${serviceEnableBlock(services) || ':'}
SVC_SCRIPT_EOF
chmod +x "\${ROOTFS}/tmp/enable-services.sh"
chroot "\${ROOTFS}" /tmp/enable-services.sh
rm -f "\${ROOTFS}/tmp/enable-services.sh"

# ── Create default user ───────────────────────────────────────
log "Creating default user 'ubuntu'..."
: "\${UBUNTU_PASSWORD:?Set UBUNTU_PASSWORD to the desired password for the ubuntu user before running this script.}"
chroot "\${ROOTFS}" useradd -m -s /bin/bash -G sudo,adm ubuntu
printf '%s:%s\n' "ubuntu" "\${UBUNTU_PASSWORD}" | chroot "\${ROOTFS}" chpasswd
chroot "\${ROOTFS}" chage -d 0 ubuntu

# ── Hostname & fstab ──────────────────────────────────────────
echo "\${DISTRO_NAME}" > "\${ROOTFS}/etc/hostname"
BOOT_UUID=\$(blkid -s UUID -o value "\${LOOP_DEV}p1")
ROOT_UUID=\$(blkid -s UUID -o value "\${LOOP_DEV}p2")
cat > "\${ROOTFS}/etc/fstab" << FSTAB_EOF
UUID=\${BOOT_UUID}  /boot/firmware  vfat  defaults  0  2
UUID=\${ROOT_UUID}  /               ext4  defaults  0  1
FSTAB_EOF

# ── Cleanup + unmount ─────────────────────────────────────────
log "Cleaning up..."
chroot "\${ROOTFS}" apt-get clean
rm -f "\${ROOTFS}/usr/bin/qemu-aarch64-static"
umount -R "\${ROOTFS}"
losetup -d "\${LOOP_DEV}"

# ── Compress ──────────────────────────────────────────────────
log "Compressing image..."
xz -T0 -z -k "\${IMG_FILE}"
sha256sum "\${IMG_FILE}.xz" > "\${IMG_FILE}.xz.sha256"

log "Build complete!"
log "Image:    \${IMG_FILE}.xz"
log "Checksum: \${IMG_FILE}.xz.sha256"
log ""
log "# Flash to SD card:"
log "# xzcat \${IMG_FILE}.xz | sudo dd of=/dev/sdX bs=4M status=progress conv=fsync"
`;
}

// ─ alarm-rpi (Arch Linux ARM for Pi) ─────────────────────────
function generateAlarmRpi(base, name) {
  const hw = state.rpiHardware || 'rpi4';
  const isRpi5 = hw === 'rpi5';
  const tarball = 'ArchLinuxARM-rpi-aarch64-latest.tar.gz';
  const tarballUrl = 'http://os.archlinuxarm.org/os/' + tarball;
  const userPkgs = enabledPkgList(base);
  const services = enabledServicesList();

  const configTxtLines = buildConfigTxt(true);

  return `${scriptHeader(name, 'alarm-rpi')}
# !! Run this script as root on a Linux host with an SD card reader !!

SD_DEVICE="\${1:-}"
if [ -z "\${SD_DEVICE}" ]; then
  echo "Usage: \$0 /dev/sdX"
  exit 1
fi

TARBALL="${tarball}"
TARBALL_URL="${tarballUrl}"

# ── Download tarball ──────────────────────────────────────────
log "Downloading Arch Linux ARM tarball..."
mkdir -p "\${BUILD_DIR}"
cd "\${BUILD_DIR}"

if [ ! -f "\${TARBALL}" ]; then
  curl -L -o "\${TARBALL}" "\${TARBALL_URL}"
  curl -L -o "\${TARBALL}.sig" "\${TARBALL_URL}.sig"
fi

# ── Verify signature (optional — requires alarm GPG key) ──────
# gpg --keyserver keyserver.ubuntu.com --recv-keys 68B3537F39A313B3E574D06777193F152BDBE6A6
# gpg --verify "\${TARBALL}.sig" "\${TARBALL}"

# ── Partition SD card ─────────────────────────────────────────
log "Partitioning \${SD_DEVICE}..."
sfdisk "\${SD_DEVICE}" << 'SFDISK_EOF'
label: dos
,256M,b,*
,,83
SFDISK_EOF

# Format
log "Formatting partitions..."
mkfs.vfat -F32 "\${SD_DEVICE}1"
mkfs.ext4 -F "\${SD_DEVICE}2"

# ── Mount ─────────────────────────────────────────────────────
log "Mounting partitions..."
mkdir -p "\${BUILD_DIR}/boot" "\${BUILD_DIR}/root"
mount "\${SD_DEVICE}2" "\${BUILD_DIR}/root"
mkdir -p "\${BUILD_DIR}/root/boot"
mount "\${SD_DEVICE}1" "\${BUILD_DIR}/boot"

# ── Extract rootfs ────────────────────────────────────────────
log "Extracting rootfs (this may take a few minutes)..."
bsdtar -xpf "\${TARBALL}" -C "\${BUILD_DIR}/root"
sync

# ── Move boot files ───────────────────────────────────────────
log "Moving boot files..."
mv "\${BUILD_DIR}/root/boot/"* "\${BUILD_DIR}/boot/"

${configTxtLines
  ? `# ── config.txt ─────────────────────────────────────────────────
log "Writing config.txt..."
CONFIG_TXT="\${BUILD_DIR}/boot/config.txt"
${configTxtLines}`
  : ''}

# ── Unmount ───────────────────────────────────────────────────
log "Syncing and unmounting..."
sync
umount "\${BUILD_DIR}/boot" "\${BUILD_DIR}/root"

log "SD card ready!"
log ""
log "Boot the Pi and then run the following to finalise:"
log ""
log "  # On first boot, log in as alarm/alarm (root: root)"
log "  # Initialise pacman keyring:"
log "  pacman-key --init"
log "  pacman-key --populate archlinuxarm"
log ""
log "  # System update:"
log "  pacman -Syu"
log ""
${userPkgs ? `log "  # Install selected packages:"
log "  pacman -S --noconfirm ${userPkgs}"
log ""` : ''}
${services ? `log "  # Enable selected services:"
${services.split(' ').filter(Boolean).map(u =>
  `log "  systemctl enable --now ${u}"`
).join('\n')}
log ""` : ''}
log "  # Rename default user (optional):"
log "  usermod -l pi alarm"
`;
}

// ─ kiwi (openSUSE) ───────────────────────────────────────────
function generateKiwi(base, name) {
  const dePackages = dePkgs(base);
  const userPkgs = enabledPkgList(base);
  const servicePkgs = enabledServicePkgList(base);
  const services = enabledServicesList();
  const suite = base.suite;
  const leapVersion = (base.label.match(/\d+\.\d+/) || ['15.6'])[0];
  const containerImage = suite === 'leap' ? `opensuse/leap:${leapVersion}` : 'opensuse/tumbleweed';

  return `${scriptHeader(name, 'kiwi', containerImage)}
KIWI_DESC="\${BUILD_DIR}/kiwi-desc"

# ── Prerequisites ─────────────────────────────────────────────
log "Installing KIWI..."
zypper install -y python3-kiwi kiwi-systemdeps-iso-media

# ── KIWI image description ─────────────────────────────────────
log "Writing KIWI image description..."
mkdir -p "\${KIWI_DESC}"

cat > "\${KIWI_DESC}/config.xml" << 'XML_EOF'
<?xml version="1.0" encoding="utf-8"?>
<image schemaversion="7.4" name="${name}">
  <description type="system">
    <author>Distro Builder Wizard</author>
    <contact>contact@example.com</contact>
    <specification>${name} — generated by OSDB wizard</specification>
  </description>
  <preferences>
    <version>1.0.0</version>
    <packagemanager>zypper</packagemanager>
    <type image="iso" flags="overlay" firmware="efi">
      <bootloader name="grub2"/>
    </type>
  </preferences>
  <repository type="rpm-md" alias="openSUSE-${suite}">
    <source path="obs://openSUSE:${suite === 'leap' ? 'Leap:15.6' : 'Tumbleweed'}/standard"/>
  </repository>
  <packages type="image">
    <package name="patterns-openSUSE-base"/>
    ${dePackages.split(' ').filter(Boolean).map(p => `<package name="${p}"/>`).join('\n    ')}
    ${userPkgs.split(' ').filter(Boolean).map(p => `<package name="${p}"/>`).join('\n    ')}
    ${servicePkgs.split(' ').filter(Boolean).map(p => `<package name="${p}"/>`).join('\n    ')}
  </packages>
  <packages type="bootstrap">
    <package name="glibc-locale"/>
    <package name="ca-certificates"/>
  </packages>
</image>
XML_EOF

cat > "\${KIWI_DESC}/config.sh" << 'CFG_EOF'
#!/bin/bash
# Called inside the image chroot during build
set -e
${serviceEnableBlock(services) || '# No services configured'}
${autologinHook(base)}
CFG_EOF
chmod +x "\${KIWI_DESC}/config.sh"

# ── Build ──────────────────────────────────────────────────────
log "Building openSUSE image (this may take 30–60 minutes)..."
kiwi-ng --profile Standard system build \\
  --description "\${KIWI_DESC}" \\
  --target-dir "\${OUTPUT_DIR}"

log "Generating SHA256 checksum..."
sha256sum "\${OUTPUT_DIR}"/*.iso > "\${OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256" 2>/dev/null || true
KIWI_ISO=\$(find "\${OUTPUT_DIR}" -maxdepth 1 -name '*.iso' | head -1)

log "Build complete!"
log "ISO:      \${KIWI_ISO}"
log "Checksum: \${DISPLAY_OUTPUT_DIR}/\${DISTRO_NAME}.iso.sha256"
`;
}

// ── Download / Run command ─────────────────────────────────────
function safeScriptName() {
  return (state.distroName || 'MyDistro').replace(/[^A-Za-z0-9_-]/g, '_');
}

function downloadScript() {
  const script = generateScript();
  const safeName = safeScriptName();
  const blob = new Blob([script], { type: 'text/x-shellscript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `build-${safeName}.sh`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Build the base64 one-liner run command for the summary page.
// The command mirrors the "curl | bash" idiom without requiring a hosted URL:
//   curl -fsSL <URL> -o script.sh && chmod +x script.sh && sudo ./script.sh
// is equivalent to:
//   echo '<base64>' | base64 -d > script.sh && chmod +x script.sh && sudo ./script.sh
function buildRunCommand() {
  const script = generateScript();
  const safeName = safeScriptName();
  // Encode script to base64; TextEncoder handles any UTF-8 content without
  // the deprecated unescape() + encodeURIComponent() workaround.
  const bytes = new TextEncoder().encode(script);
  const b64 = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
  return `echo '${b64}' | base64 -d > build-${safeName}.sh && chmod +x build-${safeName}.sh && sudo ./build-${safeName}.sh`;
}

// Update the run-command field if it is currently visible (summary step).
function refreshRunCommand() {
  const field = document.getElementById('curl-cmd-field');
  if (field) field.value = buildRunCommand();
}

// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Sync distro name input → state and download button label
  const nameInput = document.getElementById('distro-name');
  nameInput.addEventListener('input', () => {
    state.distroName = nameInput.value.trim() || 'MyDistro';
    const dlBtn = document.getElementById('btn-download');
    if (dlBtn) dlBtn.textContent = `⬇ Download build-${safeScriptName()}.sh`;
    refreshRunCommand();
  });

  // Navigation buttons
  document.getElementById('btn-prev').addEventListener('click', prevStep);
  document.getElementById('btn-next').addEventListener('click', () => {
    if (canAdvance()) nextStep();
  });
  document.getElementById('btn-cancel').addEventListener('click', () => {
    currentStepIndex = 0;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial render
  renderAll();
});

