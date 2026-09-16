#!/usr/bin/env bash
# =============================================================================
# deploy-staging.sh — push a build to the staging folder.
#
#   bash scripts/deploy-staging.sh <local-build-dir>
#   bash scripts/deploy-staging.sh build/staging
#
# LOCATION (updated 17 Sep): Hostinger created the subdomain folder INSIDE the
# live site, so the staging docroot is
#
#     ~/domains/ankuramtuition.com/public_html/staging
#
# which is reachable by TWO routes:
#     https://staging.ankuramtuition.com/     (subdomain docroot)
#     https://ankuramtuition.com/staging/     (a folder in the live site)
#
# Both must be protected, so the staging .htaccess written below carries the
# basic auth and the noindex header itself rather than relying on anything
# inherited from the live root .htaccess.
#
# Safety rules this script holds to:
#   * The only remote path it writes is .../public_html/staging. It refuses to
#     run if that path does not contain "staging".
#   * No --delete, ever.
#   * It never touches the live root .htaccess, robots.txt, sitemap.xml or any
#     live page.
#   * It never creates, reads, prints or transmits the basic-auth password.
#     The .htpasswd-staging file was made by Swastik and is only referenced.
# =============================================================================

set -euo pipefail

SRC="${1:?usage: bash scripts/deploy-staging.sh <local-build-dir>}"

SSH_PORT=65002
SSH_HOST="u879191658@145.79.212.4"
SSH_OPTS="-p ${SSH_PORT} -o ServerAliveInterval=15 -o ServerAliveCountMax=3"

SITE_DIR="domains/ankuramtuition.com"
REMOTE_ROOT="${SITE_DIR}/public_html/staging"
# Outside public_html, so it can never be served over HTTP. Absolute, because
# .htaccess AuthUserFile does not accept ~ expansion.
AUTH_FILE="/home/u879191658/domains/ankuramtuition.com/.htpasswd-staging"

# ---------------------------------------------------------------- guardrails
case "$REMOTE_ROOT" in
  *staging*) ;;
  *) echo "REFUSING: target '$REMOTE_ROOT' does not contain 'staging'." >&2; exit 2 ;;
esac
case "$REMOTE_ROOT" in
  */public_html) echo "REFUSING: target is the live web root." >&2; exit 2 ;;
esac
[ -d "$SRC" ] || { echo "REFUSING: '$SRC' is not a directory." >&2; exit 2; }
[ -f "$SRC/index.html" ] || { echo "REFUSING: no index.html in '$SRC'." >&2; exit 2; }

echo "source : $SRC"
echo "target : ${SSH_HOST}:~/${REMOTE_ROOT}"
echo "auth   : ${AUTH_FILE} (referenced only, never read)"
echo

# ------------------------------------------- 1. record the live config hashes
# Proof, before and after, that nothing on the live site moved.
echo "== 1. live config fingerprint BEFORE"
ssh ${SSH_OPTS} "$SSH_HOST" "cd ~/${SITE_DIR}/public_html && sha256sum .htaccess robots.txt sitemap.xml index.html"

# ------------------------------------------------- 2. ensure the dir exists
echo "== 2. ensuring staging directory exists"
ssh ${SSH_OPTS} "$SSH_HOST" "mkdir -p ~/${REMOTE_ROOT} && echo ok"

# ------------------------------------------------------- 3. backup + upload
echo "== 3. timestamped backup of current staging content"
ssh ${SSH_OPTS} "$SSH_HOST" \
  "mkdir -p ~/backups && cd ~/${SITE_DIR}/public_html && tar -czf ~/backups/staging-pre-deploy-\$(date +%Y%m%d-%H%M%S).tar.gz staging && echo backed-up"

echo "== 4. rsync (no --delete)"
rsync -avz --checksum -e "ssh ${SSH_OPTS}" "${SRC%/}/" "${SSH_HOST}:${REMOTE_ROOT}/"

# --------------------------------------------------- 5. staging-only .htaccess
# Self-sufficient: auth and noindex are declared here, so BOTH routes are
# covered regardless of what the parent directory does or does not inherit.
echo "== 5. writing staging .htaccess"
ssh ${SSH_OPTS} "$SSH_HOST" "cat > ~/${REMOTE_ROOT}/.htaccess" <<HTACCESS
# ---------------------------------------------------------------------------
# STAGING ONLY. Never copy this file into the live web root.
#
# This folder is reachable at BOTH:
#   https://staging.ankuramtuition.com/
#   https://ankuramtuition.com/staging/
# so the protection below must not depend on the parent .htaccess.
# ---------------------------------------------------------------------------

DirectoryIndex index.html

# Keep staging out of every index, twice over: the header covers anything
# fetched at all, the auth below stops crawlers fetching anything.
<IfModule mod_headers.c>
  Header always set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
</IfModule>

AuthType Basic
AuthName "Ankuram staging"
AuthUserFile "${AUTH_FILE}"
Require valid-user

# Clean URLs, relative to this folder. Deliberately minimal: no .html-stripping
# 301 and no trailing-slash rule, because in a subdirectory those rewrite to
# paths relative to the SITE root and would send /staging/x to /x.
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)\$ \$1.html [L]
</IfModule>
HTACCESS

# ------------------------------------------------------------ 6. robots.txt
# Only reachable as /staging/robots.txt, which no crawler consults — the real
# protection is the auth. Written anyway as a belt-and-braces marker.
echo "== 6. writing staging robots.txt"
ssh ${SSH_OPTS} "$SSH_HOST" "cat > ~/${REMOTE_ROOT}/robots.txt" <<'ROBOTS'
# Staging. Nothing here may be crawled or indexed.
User-agent: *
Disallow: /
ROBOTS

# ---------------------------------------------------------------- 7. verify
echo "== 7. verifying on the server (grep, not HTTP — the CDN caches)"
ssh ${SSH_OPTS} "$SSH_HOST" "cd ~/${REMOTE_ROOT} && \
  echo '--- files:' && find . -type f | sort && \
  echo '--- auth + noindex:' && grep -E 'AuthUserFile|X-Robots-Tag|Require|DirectoryIndex' .htaccess && \
  echo '--- auth file present (never read):' && ls -l ${AUTH_FILE}"

echo "== 8. live config fingerprint AFTER (must equal step 1)"
ssh ${SSH_OPTS} "$SSH_HOST" "cd ~/${SITE_DIR}/public_html && sha256sum .htaccess robots.txt sitemap.xml index.html"

cat <<'NEXT'

== 9. checks to run from outside
  curl -sI https://staging.ankuramtuition.com/ | head -1      # expect 401
  curl -sI https://ankuramtuition.com/staging/ | head -1      # expect 401
  curl -sI https://ankuramtuition.com/staging/ | grep -i x-robots-tag
  curl -sI https://ankuramtuition.com/ | head -1              # expect 200, live untouched
NEXT
