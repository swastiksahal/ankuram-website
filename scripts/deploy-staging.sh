#!/usr/bin/env bash
# =============================================================================
# deploy-staging.sh — push a build to staging.ankuramtuition.com.
#
# NOT RUN YET. Written in P3, to be run only after Swastik has created the
# subdomain and set the basic-auth password himself (docs/STAGING-SETUP.md).
#
#   bash scripts/deploy-staging.sh <local-build-dir>
#   bash scripts/deploy-staging.sh dist/
#
# Safety rules this script holds to:
#   * It never touches the live web root. The only remote path it writes is
#     ~/domains/staging.ankuramtuition.com/public_html.
#   * No --delete, ever. Files on staging are added or overwritten, never
#     removed, so a mistake here can never empty a directory.
#   * It refuses to run if the target path does not contain "staging".
#   * It never creates, reads, prints or transmits the basic-auth password.
#     The .htpasswd file is made by Swastik over SSH and is never touched here.
# =============================================================================

set -euo pipefail

SRC="${1:?usage: bash scripts/deploy-staging.sh <local-build-dir>}"

SSH_PORT=65002
SSH_HOST="u879191658@145.79.212.4"
SSH_OPTS="-p ${SSH_PORT} -o ServerAliveInterval=15 -o ServerAliveCountMax=3"

STAGING_DIR="domains/staging.ankuramtuition.com"
REMOTE_ROOT="${STAGING_DIR}/public_html"
# AuthUserFile lives OUTSIDE public_html so it can never be served over HTTP.
REMOTE_AUTH="${STAGING_DIR}/.htpasswd"

# ---------------------------------------------------------------- guardrails
case "$REMOTE_ROOT" in
  *staging*) ;;
  *) echo "REFUSING: target '$REMOTE_ROOT' does not contain 'staging'." >&2; exit 2 ;;
esac

if [ ! -d "$SRC" ]; then
  echo "REFUSING: '$SRC' is not a directory." >&2; exit 2
fi

if [ ! -f "$SRC/index.html" ]; then
  echo "REFUSING: '$SRC/index.html' not found — that does not look like a build." >&2; exit 2
fi

echo "source : $SRC"
echo "target : ${SSH_HOST}:~/${REMOTE_ROOT}"
echo

# ------------------------------------------------- 1. make sure the dir exists
echo "== 1. ensuring staging directory exists"
ssh ${SSH_OPTS} "$SSH_HOST" "mkdir -p ~/${REMOTE_ROOT} && echo ok"

# --------------------------------------------- 2. back up what is there first
echo "== 2. timestamped backup of the current staging content"
ssh ${SSH_OPTS} "$SSH_HOST" \
  "cd ~/${STAGING_DIR} && tar -czf ~/backups/staging-pre-deploy-\$(date +%Y%m%d-%H%M%S).tar.gz public_html 2>/dev/null || echo '(nothing to back up yet)'"

# ------------------------------------------------------------ 3. upload build
# -a archive, -z compress, -v verbose, --checksum so identical files are skipped
# on content rather than timestamp. NO --delete.
echo "== 3. rsync (no --delete)"
rsync -avz --checksum \
  -e "ssh ${SSH_OPTS}" \
  "${SRC%/}/" \
  "${SSH_HOST}:${REMOTE_ROOT}/"

# --------------------------------------------------- 4. staging-only .htaccess
# Basic auth + noindex. AuthUserFile is an absolute path outside public_html;
# $HOME is resolved remotely, not here.
echo "== 4. writing staging .htaccess"
ssh ${SSH_OPTS} "$SSH_HOST" "cat > ~/${REMOTE_ROOT}/.htaccess" <<'HTACCESS'
# ---------------------------------------------------------------------------
# STAGING ONLY. This file must never be copied to the live web root.
# ---------------------------------------------------------------------------

# Keep staging out of every index, twice over: the header covers anything that
# is fetched at all, and the basic auth below stops crawlers fetching anything.
<IfModule mod_headers.c>
  Header always set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
</IfModule>

AuthType Basic
AuthName "Ankuram staging"
AuthUserFile "__AUTH_PATH__"
Require valid-user

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Same clean-URL behaviour as production, so staging URLs match live URLs.
  RewriteRule ^index(\.html)?$ / [L,R=301]

  RewriteCond %{THE_REQUEST} /([^.]+)\.html[\s?] [NC]
  RewriteRule ^(.+)\.html$ /$1 [L,R=301]

  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)/$ /$1 [L,R=301]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>

ErrorDocument 404 /404.html
HTACCESS

# Substitute the absolute AuthUserFile path remotely.
ssh ${SSH_OPTS} "$SSH_HOST" \
  "sed -i \"s|__AUTH_PATH__|\$HOME/${REMOTE_AUTH}|\" ~/${REMOTE_ROOT}/.htaccess && grep AuthUserFile ~/${REMOTE_ROOT}/.htaccess"

# ------------------------------------------------------------ 5. robots.txt
echo "== 5. writing staging robots.txt"
ssh ${SSH_OPTS} "$SSH_HOST" "cat > ~/${REMOTE_ROOT}/robots.txt" <<'ROBOTS'
# Staging. Nothing here may be crawled or indexed.
User-agent: *
Disallow: /
ROBOTS

# ------------------------------------------------------------- 6. verify
echo "== 6. verifying on the server (grep, not HTTP — the CDN caches)"
ssh ${SSH_OPTS} "$SSH_HOST" "cd ~/${REMOTE_ROOT} && \
  echo '--- files:' && find . -type f | wc -l && \
  echo '--- robots.txt:' && cat robots.txt && \
  echo '--- htaccess auth + noindex:' && grep -E 'AuthUserFile|X-Robots-Tag|Require' .htaccess"

echo
echo "== 7. checks you must run by hand afterwards"
cat <<'NEXT'
  1. Confirm the password file exists and is OUTSIDE public_html:
       ssh -p 65002 u879191658@145.79.212.4 \
         "ls -l ~/domains/staging.ankuramtuition.com/.htpasswd"
     If it is missing, staging is WIDE OPEN. Create it per docs/STAGING-SETUP.md
     before sharing the URL with anyone.

  2. Confirm an unauthenticated request is refused (expect 401):
       curl -sI https://staging.ankuramtuition.com/ | head -1

  3. Confirm the noindex header is present:
       curl -sI https://staging.ankuramtuition.com/ | grep -i x-robots-tag

  4. Confirm the LIVE site is untouched (expect 200 and the live homepage):
       curl -sI https://ankuramtuition.com/ | head -1
NEXT
