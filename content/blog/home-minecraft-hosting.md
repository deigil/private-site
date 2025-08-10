---
title: "How I Host Multiple Minecraft Servers at Home (Safely)"
slug: "home-minecraft-hosting"
url: "/blog/home-minecraft-hosting/"
date: 2025-08-01
tags: ["minecraft", "docker", "wireguard", "nginx", "discord", "automation"]
ShowToc: true
---

> Last updated: August 2025

When I first started hosting Minecraft at home, I wanted three things: performance that felt local, the convenience of one‑click updates, and zero exposure of my home IP. This post walks through how I pieced that together—Docker for isolation, Discord bots for control, and a WireGuard+VPS hop so the world never sees where I live. Any infrastructure details below (like ports/domains) are examples, not my actual values.

### The foundation: Docker on Arch

The host is Arch Linux running Docker and Docker Compose. Each server lives in its own Compose stack using the excellent `itzg/minecraft-server` images. That gives me reproducible configs, clean upgrades, and a way to run multiple servers in parallel without dependency drama.

I keep persistent world data under `./data`, mount it into the container, and let the image handle the rest (EULA, JVM flags, healthchecks, etc.). For modded packs, the CurseForge integration is a lifesaver—point it at a pack file or a list of mods and it fetches everything.

Each server runs its own compose stack similiar to this one (my wolds modpack compose):

{{< codefold lang="yaml" preview="15" title="docker-compose.yml" >}}
services:
  mc:
    container_name: wvh
    image: itzg/minecraft-server:java17-jdk
    tty: true
    stdin_open: true
    ports:
      - "XXXXX:25565"
    environment:
      TZ: "America/Chicago"
      
      # Normal Minecraft server settings
      ONLINE_MODE: "TRUE"
      
      # Server Type
      TYPE: FORGE
      FORGE_INSTALLER: "/data/forge-1.18.2-40.2.21-installer.jar"
      
      # Memory & Performance
      MEMORY: "12G"
      
      # Server Settings
      EULA: "TRUE"
      LEVEL: "world"
      DIFFICULTY: "HARD"
      ALLOW_FLIGHT: "TRUE"
      ICON: "https://www.famousbirthdays.com/faces/iskall-image.jpg"
      # MOTD handled by MiniMOTD plugin instead
      # MOTD: "\u00a7c\u00a7k~\u00a7b\u00a7k~\u00a7d\u00a7k~ \u00a76WOLDS \u00a76A\u00a76u\u00a76t\u00a7eo\u00a7em\u00a7ea\u00a7ct\u00a7ce\u00a7cd \u00a7cServer \u00a7d\u00a7k~\u00a7b\u00a7k~\u00a7c\u00a7k~\n\u00a7r\u00a7c|| \u00a7aJoin \u00a7c|| \u00a7bdiscord.gg/JjyNfSW3RJ \u00a7c|| \u00a7a24/7 \u00a7c||"
      ENABLE_QUERY: "TRUE"
      ENABLE_COMMAND_BLOCK: "TRUE"
      SPAWN_PROTECTION: "3"
      SERVER_PORT: "25565"
      ENABLE_WHITELIST: "false"
      OPS: |
        DeiSan
      MAX_TICK_TIME: "-1"

      # CurseForge Mods
      CF_API_KEY: "XXXXXX"
      CURSEFORGE_FILES: | 
        fastload
        ftb-chunks-forge
        ftb-backups-2
        carbon-config
        distant-horizons
      MODRINTH_PROJECTS: ""
      CF_EXCLUDE_MODS: |
        reauth
        auudio-forge
        embeddium
        client-crafting
      CF_FORCE_SYNCHRONIZE: "true"
      
      # Add autostop configuration
      ENABLE_AUTOSTOP: "TRUE"
      AUTOSTOP_TIMEOUT_EST: "900"    # 15 minutes after last player disconnects
      AUTOSTOP_TIMEOUT_INIT: "600"   # 10 minutes if no one connects on startup
      AUTOSTOP_PERIOD: "30"           # Check every 30 seconds
      DEBUG_AUTOSTOP: "FALSE"          # Enable debug logging initially
      # Add health check parameters
      HEALTH_CHECK_ENABLED: "TRUE"
      HEALTH_CHECK_INTERVAL: "30s"
      HEALTH_CHECK_TIMEOUT: "5s"
      HEALTH_CHECK_RETRIES: "3"
      HEALTH_CHECK_START_PERIOD: "120s"

    restart: "no"

    volumes:
      - ./data:/data

  watchdog:
    container_name: wvhw
    image: python:3.9-slim
    restart: unless-stopped
    network_mode: "host"
    volumes:
      - ./watchdog:/app
      - /var/run/docker.sock:/var/run/docker.sock
      - .:/workspace
    command: >
      bash -c "apt-get update && 
      apt-get install -y docker.io docker-compose &&
      cd /app &&
      pip install -r req.txt &&
      chmod -R 755 . &&
      python -u main.py"
    environment:
      TZ: "America/Chicago"
      PYTHONUNBUFFERED: "1"
      PYTHONPATH: "/app"
    working_dir: /workspace

networks:
  minecraft_network:
    driver: bridge
{{< /codefold >}}
Some of the above settings are redacted, but you get the idea!

### The servers I run

I rotate between a few worlds depending on what friends want to play:

- Wolds (Forge 1.18.2, 12G RAM) on a dedicated host port mapped to the game's container port.
- Moni (1.20.1 modpack, 8G) with AUTO_CURSEFORGE. I pin the exact pack file (`CF_SLUG=monifactory`, `CF_FILE_ID=6660745`) so the environment is deterministic.
- Omni (Forge 1.12.2, 8G) and Nomi‑CE (Forge 1.12.2, 4G) when we want that classic era.

{{< figure src="/img/cloudflare_port_mapping.png" alt="Port plan" caption="Each server gets its own host port (examples shown); SRV records map friendly names to the right place." >}}

### Quality‑of‑life: Discord as the control plane

Typing into a shell is fine, but Discord is where everyone is. I wrote small watchdog bots in Python that sit next to each server:

- The Wolds bot watches Docker health every 30s, updates presence, and exposes `!start`, `!stop`, and `!update`. The update command performs a clean, progress‑reported sync of a new pack, using the same logic as my standalone updater script.
- The other servers have lightweight bots with a `!start` command and status messages.

Logs rotate to disk, and the bots automatically restart daily to stay fresh.

{{< figure src="/img/discord-bot-example.png" alt="Discord watchdog" caption="Discord watchdog posting status and responding to commands." >}}

### Safe updates without wiping the world

For big pack changes I use two entry points:

- A CLI `update.py` that downloads a zip, unpacks it under `update/`, and rsyncs into `data/` with a set of guarded exclusions (databases, configs, server icon, etc.).
- The Discord `!update` command, which triggers the same logic from inside the watchdog with progress messages.

Both approaches stop the server cleanly, sync files, and then optionally restart if it was running.

#### Update script (Python)

Below is the redacted manual updater script the Discord `!update` command wraps. Replace placeholders where noted and run it with the server stopped.

{{< codefold lang="python" preview="18" title="update.py" >}}
import os
import requests
import zipfile
import shutil
import subprocess
import sys

# --- Configuration ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # Directory where the script lives
ROOT_DIR = SCRIPT_DIR  # Assumes script is in the server root directory (e.g., wolds/)
UPDATE_DIR_NAME = "update"
DATA_DIR_NAME = "data"
DOWNLOAD_URL = "https://example.invalid/path/to/latest-pack.zip"  # TODO: set your pack URL
ZIP_FILE_NAME = "latest-pack.zip"

# Delete mods folder before syncing for a clean install
DELETE_MODS_FOLDER = True

# Files under data/ that should NOT be overwritten during updates
CONFIG_EXCLUSIONS = [
    "server-icon.png",
    "config/luckperms/luckperms-h2.mv.db",
    "config/minimotd/main.conf",
    # add more as needed (paths relative to data/)
]

UPDATE_DIR = os.path.join(ROOT_DIR, UPDATE_DIR_NAME)
DATA_DIR = os.path.join(ROOT_DIR, DATA_DIR_NAME)
ZIP_FILE_PATH = os.path.join(ROOT_DIR, ZIP_FILE_NAME)
# --- End Configuration ---

def build_rsync_exclusions():
    args = []
    for relpath in CONFIG_EXCLUSIONS:
        args.extend(["--exclude", relpath])
    return args

def confirm_deletion(path, kind="file"):
    if not os.path.exists(path):
        return True
    print(f"\n=== DELETION CONFIRMATION ===\nAbout to delete {kind}: {path}")
    while True:
        resp = input(f"Are you sure you want to delete this {kind}? (y/n): ").lower().strip()
        if resp == "y":
            return True
        if resp == "n":
            print(f"Skipping deletion of {path}")
            return False

def run_command(cmd):
    print("Running:", " ".join(cmd))
    try:
        res = subprocess.run(cmd, check=True, text=True, capture_output=True, encoding="utf-8")
        if res.stdout:
            print(res.stdout.strip())
        if res.stderr:
            print(res.stderr.strip())
        return True
    except FileNotFoundError:
        print(f"ERROR: Command not found: {cmd[0]}. Is rsync installed?", file=sys.stderr)
        return False
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Command failed with exit code {e.returncode}", file=sys.stderr)
        if e.stdout: print(e.stdout.strip(), file=sys.stderr)
        if e.stderr: print(e.stderr.strip(), file=sys.stderr)
        return False

def cleanup_update_dir(recreate=True):
    if not confirm_deletion(UPDATE_DIR, "directory"):
        return False
    if os.path.exists(UPDATE_DIR):
        shutil.rmtree(UPDATE_DIR)
    if recreate:
        os.makedirs(UPDATE_DIR, exist_ok=True)
    return True

def is_dir_empty(path):
    return not (os.path.isdir(path) and os.listdir(path))

def main():
    print("--- Starting Server Update Process ---")
    if not os.path.isdir(DATA_DIR):
        print(f"ERROR: Data directory '{DATA_DIR}' does not exist.", file=sys.stderr)
        sys.exit(1)

    # Reuse existing zip or download a fresh one
    skip_download = False
    if os.path.exists(ZIP_FILE_PATH):
        print(f"Found existing zip: {ZIP_FILE_PATH}")
        resp = input("Use it and skip download? (y/n): ").lower().strip()
        skip_download = (resp == "y")
        if not skip_download and confirm_deletion(ZIP_FILE_PATH, "file"):
            os.remove(ZIP_FILE_PATH)

    skip_download_extract = False
    if os.path.isdir(UPDATE_DIR) and not is_dir_empty(UPDATE_DIR):
        print(f"Existing update files in: {UPDATE_DIR}")
        resp = input("Use existing files (skip download & extract)? (y/n): ").lower().strip()
        if resp == "y":
            skip_download_extract = True
        else:
            if not cleanup_update_dir(recreate=True):
                print("Cannot proceed without clearing update directory.")
                sys.exit(1)
    elif not os.path.exists(UPDATE_DIR):
        os.makedirs(UPDATE_DIR)

    if not skip_download_extract:
        if not skip_download:
            print(f"Ready to download: {DOWNLOAD_URL}\nSaving to: {ZIP_FILE_PATH}")
            resp = input("Proceed with download? (y/n): ").lower().strip()
            if resp != "y":
                print("Cancelled.")
                sys.exit(0)
            try:
                with requests.get(DOWNLOAD_URL, stream=True, timeout=60) as r:
                    r.raise_for_status()
                    with open(ZIP_FILE_PATH, "wb") as f:
                        for chunk in r.iter_content(chunk_size=8192):
                            if chunk:
                                f.write(chunk)
                print("Download complete.")
            except Exception as e:
                print(f"ERROR: download failed: {e}", file=sys.stderr)
                sys.exit(1)

        print(f"Extracting {ZIP_FILE_PATH} to {UPDATE_DIR}…")
        try:
            with zipfile.ZipFile(ZIP_FILE_PATH, "r") as z:
                z.extractall(UPDATE_DIR)
        except Exception as e:
            print(f"ERROR: extract failed: {e}", file=sys.stderr)
            cleanup_update_dir(recreate=False)
            sys.exit(1)

        if os.path.exists(ZIP_FILE_PATH) and confirm_deletion(ZIP_FILE_PATH, "file"):
            try:
                os.remove(ZIP_FILE_PATH)
            except Exception as e:
                print(f"WARNING: could not delete zip: {e}", file=sys.stderr)

    print("\n=== RSYNC PREVIEW ===")
    preview_cmd = ["rsync", "-avu", "--dry-run"]
    preview_cmd.extend(build_rsync_exclusions())
    preview_cmd.extend([f"{UPDATE_DIR}/", f"{DATA_DIR}/"])
    if not run_command(preview_cmd):
        sys.exit(1)

    print("\n=== RSYNC CONFIRMATION ===")
    print("This will update files in data/ and preserve timestamps; it will NOT delete extra files.")
    if DELETE_MODS_FOLDER:
        print("It will also DELETE data/mods/ for a clean mod install.")
    resp = input("Proceed? (y/n): ").lower().strip()
    if resp != "y":
        print("Cancelled.")
        sys.exit(0)

    if DELETE_MODS_FOLDER:
        mods_dir = os.path.join(DATA_DIR, "mods")
        if os.path.isdir(mods_dir) and confirm_deletion(mods_dir, "directory"):
            shutil.rmtree(mods_dir)

    sync_cmd = ["rsync", "-avu"]
    sync_cmd.extend(build_rsync_exclusions())
    sync_cmd.extend([f"{UPDATE_DIR}/", f"{DATA_DIR}/"])
    if not run_command(sync_cmd):
        print("ERROR: rsync failed.", file=sys.stderr)
        sys.exit(1)

    print("\nUpdate synchronization completed successfully!")
    cleanup_update_dir(recreate=False)
    print("--- Server Update Process Completed Successfully ---")

if __name__ == "__main__":
    # Ensure the Minecraft server container is STOPPED before running,
    # and RESTARTED after completion.
    main()
{{< /codefold >}}

### Autostop and costs

I enable `ENABLE_AUTOSTOP=true` with a small helper that toggles a `.skip-stop` sentinel. When friends are offline, servers pause themselves; when someone pings `!start`, they come back. Idle hardware means less heat, less noise, and lower costs.

### Exposing it to the internet… without exposing home

The public edge lives on a tiny VPS in a cloud region. It peers into my home over WireGuard and uses kernel‑level DNAT/MASQUERADE rules (iptables) to forward Minecraft TCP connections through the tunnel directly to the right server. Dropping the user‑space proxy layer (like nginx stream) trims latency and simplifies the data path. From the world’s perspective, only the VPS exists; my home IP stays private.

My DNS provider handles DNS and SRV records (e.g., `mc.example.com`). SRV targets point to the VPS IP and the appropriate public port. The VPS translates that to the internal game port on the home host via WireGuard.

{{< figure src="/img/network-diagram.svg" alt="Network diagram" caption="Public clients → DNS/SRV → VPS (iptables DNAT) → WireGuard → home server." >}}

#### Forwarding manager script (VPS)

Below is the redacted/templated script I use to manage mappings. It auto‑detects your WAN and WireGuard interfaces when possible and applies per‑port DNAT rules from a simple config file. Edit placeholders as needed.

{{< codefold lang="bash" preview="18" title="mc-forward (VPS)" >}}
#!/usr/bin/env bash
set -euo pipefail

CONF_DIR="/etc/mc-forwarding.d"
MAP_FILE="$CONF_DIR/mappings.conf"      # lines: PUB_PORT [DEST_IP] DEST_PORT
ENV_FILE="$CONF_DIR/env"

mkdir -p "$CONF_DIR"; touch "$MAP_FILE"
[[ -f "$ENV_FILE" ]] || cat > "$ENV_FILE" <<'EOF'
# Defaults (override in this file)
BACKEND_IP=10.0.0.190   # example: home WG peer IP (placeholder)
WAN_IF=""               # auto-detect if empty
WG_IF=""                # auto-detect if empty
EOF

source "$ENV_FILE"

detect_wan_if(){ [[ -n "${WAN_IF:-}" ]] && { echo "$WAN_IF"; return; }; ip route get 8.8.8.8 2>/dev/null | awk '/ dev /{for(i=1;i<=NF;i++) if($i=="dev"){print $(i+1); exit}}'; }
detect_wg_if(){ [[ -n "${WG_IF:-}" ]] && { echo "$WG_IF"; return; }; ip -o link show type wireguard 2>/dev/null | awk -F': ' 'NR==1{print $2}'; }

WAN_IF="$(detect_wan_if)"; WG_IF="$(detect_wg_if)"
: "${WAN_IF:?Set WAN_IF in $ENV_FILE if auto-detect fails}"
: "${WG_IF:?Set WG_IF in $ENV_FILE if auto-detect fails}"

ensure_sysctl(){
  sysctl -w net.ipv4.ip_forward=1 >/dev/null
  sysctl -w net.ipv4.conf.all.rp_filter=2 >/dev/null || true
  sysctl -w "net.ipv4.conf.${WAN_IF}.rp_filter=2" >/dev/null || true
  sysctl -w "net.ipv4.conf.${WG_IF}.rp_filter=2" >/dev/null || true
}

ensure_chains(){
  iptables -t nat -N MC_PREROUTING 2>/dev/null || true
  iptables -t nat -C PREROUTING -i "$WAN_IF" -j MC_PREROUTING 2>/dev/null || iptables -t nat -I PREROUTING 1 -i "$WAN_IF" -j MC_PREROUTING
  iptables -t nat -N MC_POSTROUTING 2>/dev/null || true
  iptables -t nat -C POSTROUTING -o "$WG_IF" -j MC_POSTROUTING 2>/dev/null || iptables -t nat -A POSTROUTING -o "$WG_IF" -j MC_POSTROUTING
  iptables -N MC_FORWARD 2>/dev/null || true
  iptables -C FORWARD -j MC_FORWARD 2>/dev/null || iptables -I FORWARD 1 -j MC_FORWARD
}

flush_chains(){ iptables -t nat -F MC_PREROUTING || true; iptables -t nat -F MC_POSTROUTING || true; iptables -F MC_FORWARD || true; }

apply_rules(){
  ensure_sysctl; ensure_chains; flush_chains
  while read -r line; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    read -r PUB maybe_ip DEST <<<"$line" || true
    if [[ -z "${DEST:-}" ]]; then DEST_PORT="$maybe_ip"; DEST_IP="$BACKEND_IP"; else DEST_IP="$maybe_ip"; DEST_PORT="$DEST"; fi
    [[ "$PUB" =~ ^[0-9]+$ && "$DEST_PORT" =~ ^[0-9]+$ ]] || { echo "Invalid: $line" >&2; continue; }
    iptables -t nat -A MC_PREROUTING -i "$WAN_IF" -p tcp --dport "$PUB" -j DNAT --to-destination "${DEST_IP}:${DEST_PORT}"
    iptables -A MC_FORWARD -i "$WAN_IF" -o "$WG_IF" -p tcp -d "$DEST_IP" --dport "$DEST_PORT" -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
    iptables -A MC_FORWARD -i "$WG_IF" -o "$WAN_IF" -m state --state ESTABLISHED,RELATED -j ACCEPT
    iptables -t nat -A MC_POSTROUTING -o "$WG_IF" -p tcp -d "$DEST_IP" --dport "$DEST_PORT" -j MASQUERADE
  done < "$MAP_FILE"
}

case "${1:-}" in
  list) echo "WAN_IF=$WAN_IF WG_IF=$WG_IF BACKEND_IP=$BACKEND_IP"; sed -e '/^\s*$/d' -e '/^\s*#/d' "$MAP_FILE"; ;;
  add) shift; [[ $# -eq 2 || $# -eq 3 ]] || { echo "Usage: add PUB DEST_PORT | add PUB DEST_IP DEST_PORT"; exit 1; }; echo "$*" >> "$MAP_FILE"; apply_rules; ;;
  remove) shift; [[ $# -eq 1 ]] || { echo "remove PUB_PORT"; exit 1; }; grep -vE "^\s*#|^\s*$" "$MAP_FILE" | grep -vE "^\s*${1}\b" > "$MAP_FILE.tmp" || true; mv "$MAP_FILE.tmp" "$MAP_FILE"; apply_rules; ;;
  apply) apply_rules; ;;
  *) echo "Commands: list | add | remove | apply"; exit 1; ;;
esac
{{< /codefold >}}

Usage examples (placeholders):
- `sudo ./mc-forward add 25565 35565` forwards VPS port 25565 to the game server’s container port 35565 at `BACKEND_IP`.
- `sudo ./mc-forward add 25566 10.0.0.191 35565` forwards to a different home host.


Security is straightforward: `online-mode=true`, no RCON ports exposed publicly, and only WireGuard is open at home. If you self‑host, that last part is critical—don’t punch holes for game ports on your home router.

### What’s next

Spinning up a new server is just copying a Compose file, picking a free host port, dropping in a small Discord bot if needed, and updating my VPS to accomodate. As friends rotate packs, I can rotate stacks without really touching the rest of the pipeline.

If you’re curious about specifics (Compose snippets, watchdog code structure, or SRV examples), some of that stuff is already on my [GitHub](https://github.com/deigil) like the [wolds watchdog](https://github.com/deigil/mc-watchdog). Keep an eye out for more as I am constantly evolving and pushing new changes!



