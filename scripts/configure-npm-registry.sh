#!/usr/bin/env bash
set -euo pipefail

# configure npm registry/proxy settings in a project-local .npmrc file.
# usage: ./scripts/configure-npm-registry.sh [registry_url] [proxy_url]
# - registry_url: npm registry base (default: https://registry.npmjs.org/)
# - proxy_url: optional http(s) proxy URL for outbound connections.
#   if omitted, the script will skip placeholder proxy values like http://proxy:8080.
# The script keeps settings project-local to avoid polluting global npm config.

REGISTRY=${1:-"https://registry.npmjs.org/"}
RAW_PROXY=${2:-${HTTPS_PROXY:-${HTTP_PROXY:-""}}}
CAFILE=${NODE_EXTRA_CA_CERTS:-""}
NPMRC_FILE=".npmrc"

# Filter out common placeholder proxies that break installs in sandboxed environments.
if [[ "$RAW_PROXY" =~ ^http://proxy:8080/?$ ]]; then
  PROXY=""
else
  PROXY="$RAW_PROXY"
fi

cat > "$NPMRC_FILE" <<EONPMRC
registry=${REGISTRY}
strict-ssl=true
# proxy not set by default; pass a proxy URL if your network requires it
EONPMRC

if [[ -n "$PROXY" ]]; then
  echo "proxy=${PROXY}" >> "$NPMRC_FILE"
  echo "https-proxy=${PROXY}" >> "$NPMRC_FILE"
fi

if [[ -n "$CAFILE" ]]; then
  echo "cafile=${CAFILE}" >> "$NPMRC_FILE"
fi

echo "Local .npmrc written to ${NPMRC_FILE}." >&2
