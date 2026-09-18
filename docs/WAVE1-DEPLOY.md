# WAVE 1 — homepage deploy plan

**Status: NOT RUN. Written as a plan only. Nothing in this document has been
executed. It needs Swastik's explicit OK in the session that runs it.**

Wave 1 replaces one page: the homepage. It uploads three files and creates two
directories. It changes no URL, no redirect, no `.htaccess`, no `robots.txt` and
no `sitemap.xml`.

---

## What ships

| local file | remote path | size | sha256 |
|---|---|---|---|
| `build/production/index.html` | `public_html/index.html` | 100859 B | `6be7102c7dae750e5e9af1f84f165656c5a60513dfedf3b0779c5dd01a814d69` |
| `build/production/css/site.css` | `public_html/css/site.css` | 59865 B | `dbce86e7b56ed63d5a81582820b5a82d22bccece64beb7cd9d4f440f1690e0f3` |
| `build/production/js/contact-whatsapp.js` | `public_html/js/contact-whatsapp.js` | 5242 B | `8194ecd351ce7ba6815014c267a5949cf444219d5d84b13d197bbfae93eb0981` |

`public_html/css/` and `public_html/js/` do not exist on the server yet. Both are
created by step 3.

### What is NOT touched

- **`public_html/styles.css` is NOT touched.** The new homepage links
  `css/site.css` instead, but every other page on the site still links
  `styles.css`. It stays exactly where it is. Deleting or editing it would break
  92 other pages.
- **`public_html/script.js` is NOT touched.** The new homepage still loads it,
  from the same path, and so does every other page. `js/contact-whatsapp.js`
  overrides its behaviour from outside; `script.js` itself is never edited.
- `.htaccess`, `robots.txt`, `sitemap.xml` — not touched. Step 1 and step 6
  hash all three before and after to prove it.
- No other page is uploaded, moved or removed. No `rsync --delete` anywhere.

---

## Connection

Per CLAUDE.md. No password appears in this file or in any chat.

```bash
SSH_OPTS="-p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3"
SSH_HOST="u879191658@145.79.212.4"
SITE="domains/ankuramtuition.com"
```

---

## Step 0 — build and verify locally first

```bash
node design/build-c-final.js
node scripts/make-staging-build.js
node scripts/make-production-build.js
diff build/staging/index.html build/production/index.html   # must be ONLY the robots meta + STAGING comment
node scripts/parity.js build/production/index.html          # must be ALL PASS
node scripts/fingerprint.js build/production /tmp/prod-fingerprint.json
node scripts/head-parity.js /tmp/prod-fingerprint.json / build/production/index.html   # must be ALL PASS
node design/check-production.mjs                            # overflow 0 at six widths, Lighthouse
grep -c uir8kpny76 build/production/index.html              # must print 1
```

Do not continue if any of these fails.

---

## Step 1 — record the live fingerprint BEFORE

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && sha256sum .htaccess robots.txt sitemap.xml index.html styles.css script.js"
```

Save the output. Step 6 must reproduce the first three lines exactly.
Expected `index.html` before the deploy (the current live homepage):

```
a391e670f359c24f0a2df62d3882608ee2918ff46c2e214d44afe2aeb118d84b  index.html
```

---

## Step 2 — timestamped tar backup of the whole web root

```bash
ssh $SSH_OPTS $SSH_HOST "mkdir -p ~/backups && cd ~/$SITE && tar -czf ~/backups/public_html-pre-wave1-\$(date +%Y%m%d-%H%M%S).tar.gz public_html && ls -lh ~/backups | tail -3"
```

Note the exact filename it prints. The rollback in step 7 needs it.

Confirm the archive is readable and contains the homepage before going further:

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/backups && ls -t public_html-pre-wave1-*.tar.gz | head -1 | xargs -I{} tar -tzf {} public_html/index.html"
```

---

## Step 3 — create the two new directories

Neither exists on live.

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && mkdir -p css js && ls -ld css js"
```

---

## Step 4 — upload the three files

One at a time, no `--delete`, checksum-based so a re-run is a no-op.

```bash
rsync -avz --checksum -e "ssh $SSH_OPTS" build/production/css/site.css              $SSH_HOST:$SITE/public_html/css/site.css
rsync -avz --checksum -e "ssh $SSH_OPTS" build/production/js/contact-whatsapp.js    $SSH_HOST:$SITE/public_html/js/contact-whatsapp.js
rsync -avz --checksum -e "ssh $SSH_OPTS" build/production/index.html                $SSH_HOST:$SITE/public_html/index.html
```

`index.html` goes last, so the stylesheet and the script are already in place the
moment the new page starts being served.

---

## Step 5 — verify on the server with grep, not over HTTP

The CDN caches, so HTTP proves nothing until the cache is cleared.

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && \
  echo '--- the three files:' && ls -l index.html css/site.css js/contact-whatsapp.js && \
  echo '--- sha256 (must match the table at the top):' && sha256sum index.html css/site.css js/contact-whatsapp.js && \
  echo '--- tracking, must be 1 1 1:' && \
  grep -c uir8kpny76 index.html && grep -c G-MQRSS8DKLE index.html && grep -c jucWCNPv3OAbEPOvruco index.html && \
  echo '--- robots meta, must be index, follow:' && grep -o '<meta name=\"robots\"[^>]*>' index.html && \
  echo '--- must print NOTHING:' && (grep -n 'noindex\|STAGING ONLY\|G-KHP2PBXF6X\|G-MQRSS8DKKE' index.html || echo 'clean') && \
  echo '--- the six anchor ids:' && grep -o 'id=\"\(home\|about\|curricula\|contact\|reviews\|hybrid-classes\)\"' index.html | sort && \
  echo '--- styles.css and script.js still present and untouched:' && ls -l styles.css script.js"
```

Every one of those must be as described before moving on.

---

## Step 6 — live fingerprint AFTER

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && sha256sum .htaccess robots.txt sitemap.xml styles.css script.js"
```

`.htaccess`, `robots.txt`, `sitemap.xml`, `styles.css` and `script.js` must be
**byte-identical to step 1**. `index.html` is the only file whose hash changes,
and it must now equal
`6be7102c7dae750e5e9af1f84f165656c5a60513dfedf3b0779c5dd01a814d69`.

Then Swastik clears the Hostinger cache (hPanel → Clear cache), and only after
that:

```bash
curl -sI https://ankuramtuition.com/ | head -1                       # 200
curl -s  https://ankuramtuition.com/ | grep -c uir8kpny76            # 1
curl -s  https://ankuramtuition.com/ | grep -o '<meta name="robots"[^>]*>'   # index, follow
curl -sI https://ankuramtuition.com/css/site.css | head -1           # 200
curl -sI https://ankuramtuition.com/js/contact-whatsapp.js | head -1 # 200
```

---

## Step 7 — rollback, one command

Restores the homepage from the backup taken in step 2. `tar` extracts only the
single path named, so nothing else on the site is affected.

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE && tar -xzf \$(ls -t ~/backups/public_html-pre-wave1-*.tar.gz | head -1) public_html/index.html && cd public_html && sha256sum index.html"
```

That must print `a391e670f359c24f0a2df62d3882608ee2918ff46c2e214d44afe2aeb118d84b`
— the pre-deploy homepage, restored.

`css/site.css` and `js/contact-whatsapp.js` can be left in place after a
rollback: the restored homepage does not reference them, no other page
references them, and nothing links to them, so they are inert. Remove them only
if Swastik asks:

```bash
# optional, only on request
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && rm -f css/site.css js/contact-whatsapp.js && rmdir css js"
```

To roll the whole site back instead of just the homepage, extract the full
archive over it — this never deletes files, it only overwrites:

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE && tar -xzf \$(ls -t ~/backups/public_html-pre-wave1-*.tar.gz | head -1)"
```

---

## Post-deploy watch list

- Google Ads CID 786-647-2391 — the homepage is the landing domain. Check that
  the WhatsApp and phone conversions still record. Accounts 786-647-2391 and
  576-810-9746 are never modified.
- GA4 property 374743429, stream `G-MQRSS8DKLE` — realtime should show traffic
  within minutes.
- Microsoft Clarity `uir8kpny76` — a new recording should appear. This is the tag
  that was dropped in the rebuild and restored under A19; it is worth checking
  first.
- Search Console — the homepage is a Tier A URL. Watch impressions for a week.
