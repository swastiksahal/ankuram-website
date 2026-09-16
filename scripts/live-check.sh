#!/usr/bin/env bash
# live-check.sh — P0c read-only live HTTP check.
#
# Usage: bash scripts/live-check.sh <urls.txt> <out.csv>
#
# One curl per URL. HEAD only, never a body. Rate limited to at most one
# request per second: we sleep 1s plus one extra second per redirect hop,
# because a followed chain costs more than one request.

set -u
LIST="${1:?urls.txt}"
OUT="${2:?out.csv}"
HOST="https://ankuramtuition.com"
UA="AnkuramBaselineAudit/1.0 (read-only P0c check)"

printf 'url,first_status,first_location,final_status,final_url,num_redirects\n' > "$OUT"

n=0
total=$(grep -c '' "$LIST")
while IFS= read -r u; do
  [ -z "$u" ] && continue
  n=$((n + 1))

  raw=$(curl -sIL --max-time 25 -A "$UA" \
        -w '\n__META__|%{http_code}|%{url_effective}|%{num_redirects}\n' \
        "${HOST}${u}" 2>/dev/null)

  first_status=$(printf '%s' "$raw" | grep -m1 -E '^HTTP/' | awk '{print $2}')
  first_loc=$(printf '%s' "$raw" | grep -i -m1 -E '^location:' | sed 's/^[Ll]ocation: *//' | tr -d '\r')
  meta=$(printf '%s' "$raw" | grep -m1 '^__META__')
  final_status=$(printf '%s' "$meta" | cut -d'|' -f2)
  final_url=$(printf '%s' "$meta" | cut -d'|' -f3)
  hops=$(printf '%s' "$meta" | cut -d'|' -f4)

  [ -z "$first_status" ] && first_status="ERR"
  [ -z "$hops" ] && hops=0

  printf '%s,%s,"%s",%s,"%s",%s\n' \
    "$u" "$first_status" "$first_loc" "$final_status" "$final_url" "$hops" >> "$OUT"

  printf '[%d/%d] %s -> %s (final %s, %s hops)\n' "$n" "$total" "$u" "$first_status" "$final_status" "$hops" >&2

  sleep $((1 + hops))
done < "$LIST"

printf 'done: %d urls\n' "$n" >&2
