#!/usr/bin/env bash
# Shared helpers for the deployment scripts. Sourced, not executed.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -t 1 ]]; then BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'; else BOLD=""; RED=""; GREEN=""; YELLOW=""; RESET=""; fi

QUIET="${QUIET:-0}"
say()  { [[ "$QUIET" == 1 ]] || printf '%s\n' "$*"; }
step() { [[ "$QUIET" == 1 ]] || printf '\n%s==> %s%s\n' "$BOLD" "$*" "$RESET"; }
ok()   { [[ "$QUIET" == 1 ]] || printf '%s✔ %s%s\n' "$GREEN" "$*" "$RESET"; }
warn() { printf '%s! %s%s\n' "$YELLOW" "$*" "$RESET" >&2; }
die()  { printf '%s✘ %s%s\n' "$RED" "$*" "$RESET" >&2; exit 1; }

# env_value KEY DEFAULT : the shell environment wins, then .env (quotes and trailing comments ignored), then the default
env_value() {
  local v="${!1:-}"
  if [[ -n "$v" ]]; then printf '%s' "$v"; return; fi
  if [[ -f .env ]]; then
    v="$(grep -E "^$1=" .env | tail -1 | cut -d= -f2- | sed -E "s/[[:space:]]+#.*$//; s/^[\"']//; s/[\"']$//" || true)"
  fi
  printf '%s' "${v:-$2}"
}

# the public port of the web container (WEB_PORT can be "18080" or "127.0.0.1:18080")
web_port() { local p; p="$(env_value WEB_PORT 18080)"; printf '%s' "${p##*:}"; }

require_docker() {
  command -v docker >/dev/null 2>&1 || die "docker is not installed (see DOCKER.md)"
  command -v curl >/dev/null 2>&1 || die "curl is not installed (sudo apt install curl)"
  docker compose version >/dev/null 2>&1 || die "the 'docker compose' plugin is missing (sudo apt install docker-compose-v2)"
  docker info >/dev/null 2>&1 || die "cannot talk to docker. Is your user in the docker group? (sudo usermod -aG docker \$USER, then log in again)"
  [[ -f .env ]] || die ".env not found in $ROOT: create it with scripts/init-env.sh"
  check_env
}

# every secret/name must be set in the private .env and must not be a placeholder
check_env() {
  local missing=() key val
  for key in APP_SECRET JWT_PASSPHRASE DB_NAME DB_USER DB_PASSWORD DB_ROOT_PASSWORD SOCKET_PASSWORD ADMIN_EMAIL ADMIN_PASSWORD; do
    val="$(env_value "$key" "")"
    if [[ -z "$val" ]]; then missing+=("$key (missing)")
    elif [[ "$val" == *CHANGE_ME* || "$val" == *change-me* ]]; then missing+=("$key (still a placeholder)"); fi
  done
  if [[ ${#missing[@]} -gt 0 ]]; then
    printf '%s! .env is not ready: %s%s\n' "$YELLOW" "${missing[*]}" "$RESET" >&2
    die "fill them in, or run: scripts/init-env.sh --upgrade --email you@example.com (adds the missing keys, never touches the others)"
  fi
}

# true when the database container is up
db_running() { [[ -n "$(docker compose ps --status running --services 2>/dev/null | grep -x db || true)" ]]; }

# wait_healthy [seconds] : the app answers through nginx AND the API answers through nginx -> backend -> database
wait_healthy() {
  local timeout="${1:-180}" port waited=0
  port="$(web_port)"
  while (( waited < timeout )); do
    if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${port}/" \
      && curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${port}/api/categories"; then
      return 0
    fi
    sleep 3; waited=$((waited + 3))
  done
  return 1
}
