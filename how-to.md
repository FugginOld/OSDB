# How to Run Your Generated Build Script

After using the [OSDB wizard](https://fugginold.github.io/OSDB/) to configure your custom Linux distribution, you can either:

- **Download** the script (named **`build-<DistroName>.sh`**, e.g. `build-MyDistro.sh`) using the **⬇ Download** button, or  
- **Copy the ⚡ One-liner run command** from the summary page and paste it directly into your terminal.

The one-liner encodes the full script as base64 and runs it in a single step — no manual download required:

```bash
echo '<base64-encoded-script>' | base64 -d > build-MyDistro.sh && chmod +x build-MyDistro.sh && sudo ./build-MyDistro.sh
```

> ⚠️ **Security tip:** Before running any script as root, review its contents first.  
> Decode and inspect the command with `echo '<base64>' | base64 -d | less` before executing it.

This guide covers everything you need to turn either approach into a bootable ISO or SD-card image.

---

## 1. Prerequisites

Prerequisites depend on the builder selected in the wizard:

### Most builders (live-build, archiso, lorax, pi-gen, ubuntu-rpi, kiwi)

These scripts are fully self-contained: if they detect they are **not** already running inside a container they will automatically re-launch themselves inside the correct build environment via **Docker** or **Podman**. You only need one of these installed on your host machine.

| Tool | Install guide |
|------|--------------|
| Docker | <https://docs.docker.com/engine/install/> |
| Podman | <https://podman.io/docs/installation> |

### Arch Linux ARM for Raspberry Pi (alarm-rpi)

This builder writes directly to an SD card — **no container runtime is needed**. Instead it requires:

- A **Linux host** (any distro)
- **Root access** (`sudo` or root shell)
- An **SD card reader** with the target card inserted
- Standard tools: `curl`, `bsdtar`, `sfdisk`, `mkfs.vfat`, `mkfs.ext4`

---

## 2. Make the Script Executable

> **Shortcut:** If you copied the **⚡ One-liner run command** from the summary page, skip this section — the command handles `chmod +x` and execution automatically.

Open a terminal, navigate to where you saved the script, and grant it execute permission (replace `MyDistro` with the name you entered in the wizard):

```bash
chmod +x build-MyDistro.sh
```

---

## 3. Run the Build

### Most builders

Simply execute the script with `sudo`:

```bash
sudo ./build-MyDistro.sh
```

The script will:

1. Detect that it is not inside a container and pull the correct base image (e.g. `debian:bookworm`, `archlinux:latest`).
2. Re-launch itself inside that container with `--privileged` access.
3. Install the required build toolchain (e.g. `live-build`, `archiso`, `pi-gen`).
4. Apply all your wizard selections (desktop environment, packages, services, installer).
5. Produce a finished ISO or IMG file.

### Arch Linux ARM for Raspberry Pi (alarm-rpi)

Pass the SD card device path as the first argument:

```bash
sudo ./build-MyDistro.sh /dev/sdX
```

Replace `/dev/sdX` with your actual SD card device (check with `lsblk`). The script partitions, formats, and populates the card directly — no intermediate image file is created.

Build times vary by base distribution:

| Base | Typical time |
|------|-------------|
| Debian / Ubuntu (live-build) | 30 – 60 minutes |
| Arch Linux (archiso) | 20 – 40 minutes |
| Fedora (lorax) | 30 – 60 minutes |
| Raspberry Pi OS (pi-gen) | 30 – 90 minutes |

---

## 4. Customise Output Location (optional)

By default the finished image and build logs are written to `/tmp/distro-output` on your host. Override this with the `OUTPUT_DIR` environment variable before running:

```bash
OUTPUT_DIR=~/my-builds sudo -E ./build-MyDistro.sh
```

Similarly, the intermediate build tree defaults to `/var/tmp/distro-build` and can be changed with `BUILD_DIR`:

```bash
BUILD_DIR=~/build-workspace OUTPUT_DIR=~/my-builds sudo -E ./build-MyDistro.sh
```

For Debian and Ubuntu live-build images, choose a `BUILD_DIR` on a filesystem mounted with device nodes and executable scripts enabled. Hardened `/tmp` mounts often use `nodev` or `noexec`, which makes `debootstrap` fail with errors such as `mknod ... Operation not permitted`.

> **Note:** The `alarm-rpi` builder writes directly to the SD card device. `OUTPUT_DIR` and `BUILD_DIR` control the working directory for the downloaded tarball only.

---

## 5. Find Your Output

Output artifacts differ by builder:

| Builder | Output files | Checksum file | Build log |
|---------|-------------|---------------|-----------|
| **live-build** (Debian / Ubuntu) | `MyDistro.iso` | `MyDistro.iso.sha256` | `build.log` |
| **archiso** (Arch Linux) | ISO named by `mkarchiso` (e.g. `archlinux-YYYY.MM.DD-x86_64.iso`) | `MyDistro.iso.sha256` | *(none)* |
| **lorax** (Fedora) | `MyDistro.iso` | `MyDistro.iso.sha256` | *(none)* |
| **pi-gen** (Raspberry Pi OS) | `MyDistro.img` and/or `MyDistro.img.xz` | *(none)* | `build.log` |
| **ubuntu-rpi** (Ubuntu for Pi) | `MyDistro.img.xz` | `MyDistro.img.xz.sha256` | *(none)* |
| **kiwi** (openSUSE) | ISO file(s) in `OUTPUT_DIR` | `MyDistro.iso.sha256` | *(none)* |
| **alarm-rpi** (Arch ARM for Pi) | *(written directly to SD card)* | *(none)* | *(none)* |

All files are placed in `OUTPUT_DIR` (default: `/tmp/distro-output`) except for `alarm-rpi`, which writes directly to the target SD card device.

---

## 6. Verify the Checksum

Before writing the image to any media, confirm it was not corrupted:

```bash
sha256sum -c MyDistro.iso.sha256
```

A successful result looks like:

```
MyDistro.iso: OK
```

---

## 7. Write to Media

### ISO → USB drive (x86-64 distributions)

Replace `/dev/sdX` with your USB device (check with `lsblk`):

```bash
sudo dd if=/tmp/distro-output/MyDistro.iso of=/dev/sdX bs=4M status=progress conv=fsync
sync
```

Alternatively use a graphical tool such as [Balena Etcher](https://etcher.balena.io/).

### IMG → SD card (Raspberry Pi distributions)

For a plain `.img` file:

```bash
sudo dd if=/tmp/distro-output/MyDistro.img of=/dev/sdX bs=4M status=progress conv=fsync
sync
```

For a compressed `.img.xz` file:

```bash
xzcat /tmp/distro-output/MyDistro.img.xz | sudo dd of=/dev/sdX bs=4M status=progress conv=fsync
sync
```

> ⚠️ **Double-check the device path** before running `dd`. Writing to the wrong device will overwrite that disk's data.

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `Docker or Podman is required…` error | Neither container runtime is installed | Install [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/docs/installation) |
| `This script must be run as root` error | Script was not invoked with root privileges | Re-run with `sudo ./build-MyDistro.sh` (or `sudo ./build-MyDistro.sh /dev/sdX` for `alarm-rpi`) |
| `debootstrap` fails with `mknod ... Operation not permitted` or says the target is mounted with `noexec`/`nodev` | `BUILD_DIR` is on a restricted filesystem, commonly `/tmp` | Re-run with `sudo BUILD_DIR=/var/tmp/distro-build ./build-MyDistro.sh` or another build path on a `dev,exec` filesystem |
| Build fails partway through | Network issue or package mirror outage | Check `build.log` in `OUTPUT_DIR`, retry after a few minutes |
| No ISO/IMG in output directory | Build error before the copy step | Review `build.log` for the first `ERROR` line |
| Slow build on first run | Container image being pulled | Subsequent runs reuse the cached image and are faster |

---

## 9. Re-running and Cleaning Up

To start a completely fresh build, remove the intermediate build directory:

```bash
rm -rf /var/tmp/distro-build
```

To free up Docker/Podman disk space after building:

```bash
docker system prune   # or: podman system prune
```
