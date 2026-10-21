#!/usr/bin/env bash
# Read-only diagnostics. Does not print environment variables or credentials.
set -u
printf 'Repository: %s\n' "$PWD"
node --version
if command -v pm2 >/dev/null 2>&1; then
  pm2 list
else
  printf 'PM2 is not installed for this user.\n'
fi
if command -v ss >/dev/null 2>&1; then
  printf '\nListening web ports:\n'
  ss -ltnp | awk 'NR == 1 || /:(80|443|3000|3001|5000|8080)[[:space:]]/'
fi
if command -v systemctl >/dev/null 2>&1; then
  printf '\nRelated running services:\n'
  systemctl list-units --type=service --state=running --no-pager 2>/dev/null | awk '/node|pm2|maati|nginx|apache|caddy/'
fi
if command -v curl >/dev/null 2>&1; then
  printf '\nLocal server health on port 5000:\n'
  curl --silent --show-error --max-time 5 http://127.0.0.1:5000/api/health || true
  printf '\nLocal Studio API (401 means the route is installed):\n'
  curl --silent --show-error --max-time 5 --write-out '\nHTTP %{http_code}\n' http://127.0.0.1:5000/api/admin/session || true
fi
