# Debian 12 Bookworm LLM / AI Workstation and Inference Server

## Purpose

GPU-ready local LLM environment for model inference, retrieval-augmented generation, embeddings, code-generation assistants, model-serving APIs, and optional lightweight fine-tuning experiments.

This profile is intentionally available only for distros that are practical LLM targets. It favors current x86_64 Linux releases with usable NVIDIA CUDA/container paths and a reasonable AMD ROCm path where supported by hardware and vendor packages.

## Default Installation Mode

Headless server by default. Desktop environment is optional and should only be installed when the system will be used as a local workstation with an IDE, browser, or GUI monitoring tools.

## Compatibility Scope

- CPU architecture: primarily `x86_64` / `amd64`.
- Recommended GPU path: NVIDIA CUDA with NVIDIA Container Toolkit.
- AMD GPU path: ROCm only when the exact GPU and OS release are supported by AMD.
- CPU-only path: allowed for small models, embeddings, testing, and development, but not recommended as the primary target for large local LLM serving.
- Not intended for Raspberry Pi, ARM appliance images, or old/EOL distro releases.

## Core System Packages

```text
build-essential
linux-headers-$(uname -r)
ca-certificates
curl
gnupg
lsb-release
software-properties-common
python3
python3-dev
python3-venv
python3-pip
pipx
git
git-lfs
cmake
ninja-build
pkg-config
gcc
g++
make
clang
llvm
numactl
hwloc
libopenblas-dev
libssl-dev
libffi-dev
sqlite3
redis-tools
jq
yq
ripgrep
fd-find
wget
aria2
tmux
btop
nvtop
docker.io
docker-compose-plugin
podman
nvidia-driver
nvidia-container-toolkit
```

## Python / LLM Runtime Stack

Install these inside a project virtual environment, `uv` environment, or container image rather than globally where possible.

```text
uv
pip
setuptools
wheel
numpy
scipy
pandas
pyarrow
pydantic
fastapi
uvicorn
jupyterlab
ipykernel
torch
torchvision
torchaudio
transformers
accelerate
safetensors
sentence-transformers
datasets
evaluate
tokenizers
huggingface-hub
optimum
peft
bitsandbytes
llama-cpp-python
faiss-cpu
chromadb
qdrant-client
openai
anthropic
litellm
pytest
ruff
mypy
pre-commit
```

## Optional LLM Applications / Services

```text
ollama
open-webui
llama.cpp
vllm
text-generation-webui
koboldcpp
langchain
llama-index
qdrant
redis
postgresql with pgvector
prometheus
node-exporter
grafana
```

## Container Runtime Requirements

```text
docker
containerd
nvidia-container-toolkit
optional podman
optional compose plugin
```

Expected service behavior:

```text
docker enabled when container workflows are selected
ollama enabled only when local model service is requested
open-webui enabled only when web UI is requested
qdrant/postgresql/redis enabled only when RAG or application stack requires them
ssh enabled for headless administration
firewall enabled with only required API/UI ports exposed
```

## GPU Setup Notes

### NVIDIA

- Install the distro-appropriate NVIDIA driver.
- Install NVIDIA Container Toolkit when Docker/containers will access the GPU.
- Validate with:

```bash
nvidia-smi
docker run --rm --gpus all nvidia/cuda:12.6.0-base-ubuntu24.04 nvidia-smi
```

### AMD ROCm

- Validate the exact AMD GPU against AMD ROCm support before installing ROCm packages.
- Prefer vendor-supported OS/GPU combinations.
- Validate with:

```bash
rocminfo
rocm-smi
```

### CPU-only fallback

Use CPU-only for automation testing, small models, embeddings, and CI validation.

```bash
python - <<'PY'
import torch
print('torch:', torch.__version__)
print('cuda:', torch.cuda.is_available())
PY
```

## Storage Layout

Recommended mount points:

```text
/opt/llm                 application stacks and compose files
/srv/models              shared model cache
/srv/datasets            datasets and corpora
/srv/vectorstores        vector databases and indexes
/var/lib/docker          container storage, preferably NVMe
/home/<user>/.cache/huggingface optional user cache
```

Recommended environment variables:

```bash
export HF_HOME=/srv/models/huggingface
export TRANSFORMERS_CACHE=/srv/models/huggingface/transformers
export OLLAMA_MODELS=/srv/models/ollama
export VLLM_CACHE_ROOT=/srv/models/vllm
```

## Selectable Desktop Environment Options

Install one lightweight desktop only when workstation use is requested:

- GNOME for general workstation use.
- KDE Plasma for a full desktop workstation.
- XFCE or LXQt for a lighter GPU/CPU footprint.
- No desktop for dedicated inference servers.

## Security / Operations Guardrails

```text
Do not expose model APIs publicly without authentication and firewall rules.
Do not run web UIs as root.
Do not store secrets in compose files or shell history.
Pin model-serving images for repeatable deployments.
Use separate volumes for models, datasets, vector stores, and application data.
Document GPU driver, CUDA, ROCm, Python, and container versions.
Avoid mixing distro Python packages and pip packages globally.
Keep old model caches pruned to avoid filling root or Docker volumes.
```

## Validation Commands

```bash
apt-cache policy <package> && apt-cache search <term>
sudo apt update && sudo apt install <packages>
python3 --version
docker --version
nvidia-smi || true
rocminfo || true
ollama --version || true
```

## Example Install Pattern

```bash
sudo apt update && sudo apt install <packages>
```
