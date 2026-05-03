# OSDB — Linux OS Distro Builder Wizard

**🔗 Live wizard:** <https://fugginold.github.io/OSDB/>

A self-contained, static WebUI that walks you through building a custom Linux distribution and outputs a ready-to-run `build-distro.sh` bash script — no backend required.

---

## How it works

1. Open the wizard in your browser
2. Choose your **base distribution** (Debian, Ubuntu, Arch, Fedora, Raspberry Pi, openSUSE)
3. Select a **desktop environment** (GNOME, KDE, XFCE, headless, …)
4. Choose an **environment preset** (Core Package Set) and configure **services**
5. Pick a **repository type** and **installer**
6. Review the **summary**, download your customised build script, and copy the **one-liner run command**

The generated script is a complete, commented bash script ready to run on a matching host system.
The **⚡ One-liner run command** on the summary page encodes the script as base64, so you can
paste a single command into any terminal to download, `chmod +x`, and execute it in one step — no
separate download needed.

---

## Supported bases

| Distribution | Track | Builder | Output |
| --- | --- | --- | --- |
| Debian 10 Buster | legacy (EOL) | live-build | ISO |
| Debian 11 Bullseye | oldstable | live-build | ISO |
| Debian 12 Bookworm | stable | live-build | ISO |
| Debian 13 Trixie | beta | live-build | ISO |
| Ubuntu 20.04 LTS Focal | lts-legacy | live-build | ISO |
| Ubuntu 22.04 LTS Jammy | lts | live-build | ISO |
| Ubuntu 24.04 LTS Noble | lts-current | live-build | ISO |
| Ubuntu 24.10 Oracular | current | live-build | ISO |
| Ubuntu 25.04 Plucky | beta | live-build | ISO |
| Arch Linux (rolling) | rolling | archiso | ISO |
| Arch Linux ARM | rolling | archiso | ISO |
| Fedora 40–42 | stable/current/beta | lorax | ISO |
| Raspberry Pi OS Lite (Bookworm) | stable | pi-gen | IMG |
| Raspberry Pi OS Desktop (Bookworm) | stable | pi-gen | IMG |
| Raspberry Pi OS Full (Bookworm) | stable | pi-gen | IMG |
| Ubuntu 22.04 LTS for RPi | lts | ubuntu-rpi | IMG |
| Ubuntu 24.04 LTS for RPi | lts-current | ubuntu-rpi | IMG |
| Arch Linux ARM — Pi 4 | rolling | alarm-rpi | IMG |
| Arch Linux ARM — Pi 5 | rolling | alarm-rpi | IMG |
| openSUSE Leap 15.6 | stable | kiwi | ISO |
| openSUSE Tumbleweed | rolling | kiwi | ISO |
| Gentoo Linux | rolling | catalyst | ISO |

---

## Environment Presets

The Packages step uses **Quick Presets** sourced from `docs/environments/<base>_environment_profiles/.../environment.md`.

- Each preset corresponds to one environment profile: minimum, server, desktop, gaming, education, coding, practical maximum, and **LLM / AI Workstation & Inference Server**.
- The wizard parses each profile's `## Core Package Set` or `## Core System Packages`.
- Selecting a preset expands the tile to show the exact package list and package count.

### LLM / AI Profile Availability

The LLM / AI preset is shown only for distro bases that include `08_llm_ai_workstation_inference_server/environment.md`.

Included targets currently:

- Debian 11/12/13
- Ubuntu 20.04/22.04/24.04/25.04
- Arch Linux
- Fedora 41/42
- openSUSE Leap 15.5/current Leap/Tumbleweed
- Gentoo

Excluded targets include older/EOL releases and ARM/Raspberry Pi-focused bases where this profile is not provided.

---

## Running locally

No build step needed — just open `docs/index.html` in a browser:

```bash
cd docs
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Screenshots

| Step | Screenshot |
| --- | --- |
| **Step 1 — Choose Base System** | ![Step 1 – Base](docs/assets/screenshots/step1-base.png) |
| **Hardware Target** *(Raspberry Pi only)* | ![Step 1b – RPi Hardware](docs/assets/screenshots/step1b-rpi-hardware.png) |
| **Step 2 — Desktop Environment** | ![Step 2 – Desktop](docs/assets/screenshots/step2-desktop.png) |
| **Step 3 — Packages** | ![Step 3 – Packages](docs/assets/screenshots/step3-packages.png) |
| **Step 4 — Repository** | ![Step 4 – Repository](docs/assets/screenshots/step4-repository.png) |
| **Step 5 — Installer** | ![Step 5 – Installer](docs/assets/screenshots/step5-installer.png) |
| **Step 6 — Services** | ![Step 6 – Services](docs/assets/screenshots/step6-services.png) |
| **Step 7 — Summary** | ![Step 7 – Summary](docs/assets/screenshots/step7-summary.png) |

---

## Contributing

See [docs/architecture.md](docs/architecture.md) for the module map, data flow, and a step-by-step guide to adding a new distro or Build Tool.

## License

[LICENSE](LICENSE)
