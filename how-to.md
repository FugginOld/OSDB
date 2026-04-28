# How to Run Your Generated `build-distro.sh`

After using the [OSDB wizard](https://fugginold.github.io/OSDB/) to configure your custom Linux distribution, you will download a `build-distro.sh` script. This guide walks you through everything you need to do to turn that script into a bootable ISO or SD-card image.

---

## 1. Prerequisites

The script is fully self-contained: if it detects it is **not** already running inside a container it will automatically re-launch itself inside the correct build environment via **Docker** or **Podman**. You only need one of these installed on your host machine.

| Tool | Install guide |
|------|--------------|
| Docker | <https://docs.docker.com/engine/install/> |
| Podman | <https://podman.io/docs/installation> |

> **Note:** If you are already running on a native host that matches the target distribution (e.g. building a Debian ISO on a Debian machine) a container runtime is still required because the build tools need root-level access to loop devices and chroot environments.

---

## 2. Make the Script Executable

Open a terminal, navigate to where you saved the script, and grant it execute permission:

```bash
chmod +x build-distro.sh
```

---

## 3. Run the Build

Simply execute the script:

```bash
./build-distro.sh
```

The script will:

1. Detect that it is not inside a container and pull the correct base image (e.g. `debian:bookworm`, `archlinux:latest`).
2. Re-launch itself inside that container with `--privileged` access.
3. Install the required build toolchain (e.g. `live-build`, `archiso`, `pi-gen`).
4. Apply all your wizard selections (desktop environment, packages, services, installer).
5. Produce a finished ISO or IMG file.

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
OUTPUT_DIR=~/my-builds ./build-distro.sh
```

Similarly, the intermediate build tree defaults to `/tmp/distro-build` and can be changed with `BUILD_DIR`:

```bash
BUILD_DIR=~/build-workspace OUTPUT_DIR=~/my-builds ./build-distro.sh
```

---

## 5. Find Your Output

When the build completes successfully you will see a summary like:

```
[12:34:56] Build complete!
[12:34:56] ISO:      /tmp/distro-output/MyDistro.iso
[12:34:56] Checksum: /tmp/distro-output/MyDistro.iso.sha256
```

The output directory will contain:

| File | Description |
|------|-------------|
| `MyDistro.iso` | Bootable hybrid ISO (x86-64 distributions) |
| `MyDistro.img` / `MyDistro.img.xz` | Bootable SD-card image (Raspberry Pi distributions) |
| `MyDistro.iso.sha256` | SHA-256 checksum for integrity verification |
| `build.log` | Full build output for troubleshooting |

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
| `This script must be run as root` error | Running inside container without root | The container re-launch adds `--privileged`; ensure Docker/Podman daemon is accessible |
| Build fails partway through | Network issue or package mirror outage | Check `build.log` in `OUTPUT_DIR`, retry after a few minutes |
| No ISO/IMG in output directory | Build error before the copy step | Review `build.log` for the first `ERROR` line |
| Slow build on first run | Container image being pulled | Subsequent runs reuse the cached image and are faster |

---

## 9. Re-running and Cleaning Up

To start a completely fresh build, remove the intermediate build directory:

```bash
rm -rf /tmp/distro-build
```

To free up Docker/Podman disk space after building:

```bash
docker system prune   # or: podman system prune
```
