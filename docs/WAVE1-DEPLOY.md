# WAVE 1 — homepage deploy

**Status: EXECUTED 18 Sep 2026, on Swastik's explicit approval. Steps 0–6 ran in
order, plus three additional verifications. No rollback was needed. The actual
output of every step is recorded in "Execution record" at the foot of this file.**

Backup taken before the deploy:
`~/backups/public_html-pre-wave1-20260918-101018.tar.gz` (1.5M, 190 entries).

Wave 1 replaces one page: the homepage. It uploads three files and creates two
directories. It changes no URL, no redirect, no `.htaccess`, no `robots.txt` and
no `sitemap.xml`.

---

## What ships

These are the A20 hashes, as actually deployed and as verified on the server in
step 5. (An earlier revision of this file carried the A19 hashes for
`index.html` and `site.css`; A20 changed both. `contact-whatsapp.js` is
unchanged by A20 and its hash is the same in both revisions.)

| local file | remote path | size | sha256 |
|---|---|---|---|
| `build/production/index.html` | `public_html/index.html` | 101559 B | `34e1f1f1e86fe0ddb7f421a941ad432d8c403fdd8c1b70f617422cf41db969cc` |
| `build/production/css/site.css` | `public_html/css/site.css` | 60552 B | `451d14a591a3c39ca50bb3d1b9b3df5fb16cce80a453997c79bddbea92575949` |
| `build/production/js/contact-whatsapp.js` | `public_html/js/contact-whatsapp.js` | 5242 B | `8194ecd351ce7ba6815014c267a5949cf444219d5d84b13d197bbfae93eb0981` |

That `contact-whatsapp.js` row is the WAVE 1 file. It was superseded on the same
day by A21 — see "A21 single-file deploy" at the foot of this file for the
current hash.

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
  echo '--- tracking, must be 1 then 2 then 1:' && \
  grep -c uir8kpny76 index.html && grep -c G-MQRSS8DKLE index.html && grep -c jucWCNPv3OAbEPOvruco index.html && \
  echo '--- robots meta, must be index, follow:' && grep -o '<meta name=\"robots\"[^>]*>' index.html && \
  echo '--- must print NOTHING:' && (grep -n 'noindex\|STAGING ONLY\|G-KHP2PBXF6X\|G-MQRSS8DKKE' index.html || echo 'clean') && \
  echo '--- the six anchor ids:' && grep -o 'id=\"\(home\|about\|curricula\|contact\|reviews\|hybrid-classes\)\"' index.html | sort && \
  echo '--- styles.css and script.js still present and untouched:' && ls -l styles.css script.js"
```

Every one of those must be as described before moving on.

`G-MQRSS8DKLE` legitimately appears **twice**: once in the gtag loader URL and
once in `gtag('config', …)`. The builder guard asserts exactly 2 and head-parity
confirms 2. Only Clarity and the WhatsApp label must be exactly 1.

---

## Step 6 — live fingerprint AFTER

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && sha256sum .htaccess robots.txt sitemap.xml styles.css script.js"
```

`.htaccess`, `robots.txt`, `sitemap.xml`, `styles.css` and `script.js` must be
**byte-identical to step 1**. `index.html` is the only file whose hash changes,
and it must now equal
`34e1f1f1e86fe0ddb7f421a941ad432d8c403fdd8c1b70f617422cf41db969cc`.

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

---

# Execution record — 18 September 2026

Run on Swastik's explicit approval. One step at a time, real output quoted.

## Step 0 — local checks, ALL PASS

- `diff build/staging/index.html build/production/index.html` → only the two
  robots lines (`9,10c9`).
- `scripts/parity.js build/production/index.html` → **ALL PASS**, word count
  3464 vs live 3226 = **107.4%**, baseline strings **427/432**, six anchor ids.
- `scripts/head-parity.js` → **ALL PASS**, including every live h2 and h3
  present as a heading, 50/50 live h3 at h3.
- `grep -c uir8kpny76 build/production/index.html` → **1**.
- `design/check-production.mjs` → overflow **0** at 360/390/768/1024/1280/1440;
  Lighthouse mobile perf 95 / a11y 100 / BP 79 / SEO 100 / CLS 0, desktop
  100 / 100 / 78 / 100 / CLS 0.

## Step 1 — live fingerprint BEFORE

```
4587cf66071257971ed49b2fabc0b9ae380bcd1f9e7feccf9c21197f59ae17db  .htaccess
43ed0d0e71b037ff80f0aa299b8a15c0f60724f1cdb7064d19b129052fffe329  robots.txt
6d9d9940d77d471e4269276c843356fc85f15dbda2e8cafe0d9c5d7158a31c6b  sitemap.xml
a391e670f359c24f0a2df62d3882608ee2918ff46c2e214d44afe2aeb118d84b  index.html
c75ae294e9f8da3581da4a3bf52a5a09307e2f77be1cb279ae3f28b4832043c2  styles.css
1bf4f312561dc7917a432deb1d6675cf485f512be184e5d1b5106833a142a364  script.js
```

`index.html` matched the expected pre-deploy hash exactly.

## Step 2 — backup

```
-rw-r--r-- 1 u879191658 o1008120454 1.5M Sep 18 10:10 /home/u879191658/backups/public_html-pre-wave1-20260918-101018.tar.gz
```

Archive verified readable: `tar -tzf … public_html/index.html` listed
`public_html/index.html`; 190 entries total.

## Step 3 — directories created

```
drwxr-xr-x 2 u879191658 o1008120454 4096 Sep 18 10:10 css
drwxr-xr-x 2 u879191658 o1008120454 4096 Sep 18 10:10 js
```

## Step 4 — upload

Three separate rsyncs, `--checksum`, no `--delete`, `index.html` last.
60552 B, 5242 B, 101559 B transferred.

## Step 5 — server-side verification

```
-rw-r--r-- 1 u879191658 o1008120454  60552 Sep 18 10:09 css/site.css
-rw-r--r-- 1 u879191658 o1008120454 101559 Sep 18 10:09 index.html
-rw-r--r-- 1 u879191658 o1008120454   5242 Sep 18 10:09 js/contact-whatsapp.js

34e1f1f1e86fe0ddb7f421a941ad432d8c403fdd8c1b70f617422cf41db969cc  index.html
451d14a591a3c39ca50bb3d1b9b3df5fb16cce80a453997c79bddbea92575949  css/site.css
8194ecd351ce7ba6815014c267a5949cf444219d5d84b13d197bbfae93eb0981  js/contact-whatsapp.js
```

All three identical to the local `build/production` files. Tracking counts
1 / 2 / 1 as expected. Robots meta `<meta name="robots" content="index, follow">`.
The forbidden-string grep printed `clean`. All six anchor ids present.
`styles.css` (Aug 28 15:15) and `script.js` (Jun 17 11:26) kept their original
timestamps — untouched.

## Step 6 — live fingerprint AFTER

```
4587cf66071257971ed49b2fabc0b9ae380bcd1f9e7feccf9c21197f59ae17db  .htaccess     unchanged
43ed0d0e71b037ff80f0aa299b8a15c0f60724f1cdb7064d19b129052fffe329  robots.txt    unchanged
6d9d9940d77d471e4269276c843356fc85f15dbda2e8cafe0d9c5d7158a31c6b  sitemap.xml   unchanged
c75ae294e9f8da3581da4a3bf52a5a09307e2f77be1cb279ae3f28b4832043c2  styles.css    unchanged
1bf4f312561dc7917a432deb1d6675cf485f512be184e5d1b5106833a142a364  script.js     unchanged
34e1f1f1e86fe0ddb7f421a941ad432d8c403fdd8c1b70f617422cf41db969cc  index.html    THE ONLY CHANGE
```

No Hostinger cache clear was needed: the CDN served the new file immediately.
`curl https://ankuramtuition.com/ | sha256sum` returned `34e1f1f1…`, matching the
deployed build. `/css/site.css` and `/js/contact-whatsapp.js` both return 200.

## Addition 1 — the rest of the site is unaffected

All six pages 200, title byte-identical to the pre-deploy snapshot AND identical
to the baseline once entities are decoded on both sides:

| page | HTTP | title |
|---|---|---|
| `/about/` | 200 | identical |
| `/how-we-teach` | 200 | identical |
| `/cbse-class-10/` | 200 | identical |
| `/online-tuition-class-10-cbse/` | 200 | identical |
| `/areas/gachibowli` | 200 | identical |
| `/ib-myp-tuition-hyderabad` | 200 | identical |

## Addition 2 — the live page renders

`design/verify-live.mjs` and `design/verify-live-2.mjs`, against the live URL.
Screenshots: `design/screens/LIVE-390.png`, `design/screens/LIVE-1440.png`.

| check | 390x844 | 1440x900 |
|---|---|---|
| console errors (clean load) | none | none |
| `css/site.css` | 200 | 200 |
| `js/contact-whatsapp.js` | 200 | 200 |
| `script.js` | 200 | 200 |
| horizontal overflow | 0 | 0 |
| FAQ opens / closes | yes / yes | yes / yes |
| grade tabs switch | yes, 1 panel visible | yes, 1 panel visible |
| swipe row scrolls | yes, 969px in a 390px track | n/a |

## Addition 3 — conversion wiring

Verified with outbound Google beacons blocked at the network layer, so no test
conversion was written to account 786-647-2391. The contact form was **not**
submitted; its handler and generated URL were inspected instead, so no WhatsApp
message was sent.

| control | resolves to | conversion fired |
|---|---|---|
| WhatsApp button | `https://wa.me/917396669430` | 1 × `AW-10954184691/jucWCNPv3OAbEPOvruco` |
| Phone link | `tel:+917396669430` | 1 × `AW-10954184691/NGIFCNbv3OAbEPOvruco` |
| "Send Message" | `handleFormSubmitWhatsApp`, A14 override loaded | fires the WhatsApp label on submit |

Observed gtag calls on the phone click:

```
["event","phone_click",{"event_category":"Contact","event_label":"Phone Call"}]
["event","conversion",{"send_to":"AW-10954184691/NGIFCNbv3OAbEPOvruco"}]
```

On the WhatsApp click:

```
["event","conversion",{"send_to":"AW-10954184691/jucWCNPv3OAbEPOvruco"}]
```

The form's generated URL (built, never opened):

```
https://wa.me/917396669430?text=Hi%20Swastik%2C%20I'd%20like%20to%20enquire%20about%20tuition.%0AName%3A%20…
```

6 `wa.me` links and 8 `tel:` links on the page, all wired through the same
delegated listener.

Live tracking confirmed loading on the deployed page: GA4 collect 204, Ads
`viewthroughconversion` 200, Clarity tag 200, `clarity.js` 200, Clarity collect
204. A handful of `net::ERR_ABORTED` duplicate beacons appear, and the untouched
`/how-we-teach` shows the identical pattern, so it is a headless-browser
artifact, not a wave 1 effect.

## Rollback

Not needed. Not run. The step 7 command remains valid against
`public_html-pre-wave1-20260918-101018.tar.gz`.

---

# A21 single-file deploy — 18 September 2026

Approved separately. One file: `js/contact-whatsapp.js`. `index.html` and
`css/site.css` were NOT re-uploaded — they are byte-identical to what was
already live, so wave 1's `index.html` hash must not move, and it did not.

## Step 1 — backup

```
-rw-r--r-- 1 u879191658 o1008120454 1.5M Sep 18 12:51 /home/u879191658/backups/public_html-pre-a21-20260918-125111.tar.gz
```

194 entries (wave 1's 190 plus `css/`, `css/site.css`, `js/`,
`js/contact-whatsapp.js`). Verified to contain both
`public_html/js/contact-whatsapp.js` and `public_html/index.html`.

## Steps 2 and 4 — hashes before and after

| file | before | after | |
|---|---|---|---|
| `.htaccess` | `4587cf66…` | `4587cf66…` | unchanged |
| `robots.txt` | `43ed0d0e…` | `43ed0d0e…` | unchanged |
| `sitemap.xml` | `6d9d9940…` | `6d9d9940…` | unchanged |
| `index.html` | `34e1f1f1…` | `34e1f1f1…` | unchanged, mtime still Sep 18 10:09 |
| `styles.css` | `c75ae294…` | `c75ae294…` | unchanged |
| `script.js` | `1bf4f312…` | `1bf4f312…` | unchanged |
| `css/site.css` | `451d14a5…` | `451d14a5…` | unchanged |
| `js/contact-whatsapp.js` | `8194ecd3…` | **`1e48b2de…`** | THE ONLY CHANGE |

`1e48b2de8f98bc3723bf988f88535d54ce78e9060c15ce42fa7b0f0510307e8a` is exactly
the local `build/production/js/contact-whatsapp.js`, 9683 B.

## Step 3 — upload

One rsync, `--checksum`, no `--delete`, 9683 B.

## Step 5 — inline handlers on the LIVE url

`node design/check-inline-handlers.mjs https://ankuramtuition.com/`

```
  OK  window.trackCTAClick         typeof=function
  OK  window.trackFormSubmission   typeof=function
  OK  window.trackPhoneClick       typeof=function
  OK  window.trackWhatsAppClick    typeof=function
  page errors on load: none
  PASS — every inline handler resolves at runtime
```

Run with `CACHE_BUST=1`, for the reason in "CDN cache" below. Without it, all
four still report `undefined`, because the edge is serving the pre-A21 file.

## Step 6 — live behaviour, mobile UA, 390x844

wa.me, api.whatsapp.com and every Google/Clarity beacon aborted, so no message
reached Swastik and no test conversion was written to account 786-647-2391.

**A. Contact form, Name + Phone**

```
https://wa.me/917396669430?text=Hi%20Swastik%2C%20I%27d%20like%20to%20enquire%20about%20tuition.%0AName%3A%20Test%20Parent%0APhone%3A%209876543210
decoded: "Hi Swastik, I'd like to enquire about tuition.\nName: Test Parent\nPhone: 9876543210"
```

1 navigation · GA4 `form_submission` **1** · dataLayer `form_submission` **1** ·
Ads `jucWCNPv3OAbEPOvruco` **1** · conversion events of any label **1** ·
ReferenceErrors **0** · errors none.

**B. tel: link** — GA4 `phone_call_click` 1, script.js's own `phone_click` 1,
dataLayer `phone_call` 1, Ads `NGIFCNbv3OAbEPOvruco` **1**, conversion events of
any label **1**, ReferenceErrors 0.

**C. wa.me link and CTA link** — GA4 `whatsapp_click` 1 + Ads
`jucWCNPv3OAbEPOvruco` **1**; GA4 `cta_click` 1, dataLayer `cta_click` 1;
ReferenceErrors 0.

Nothing fires twice. Before A21 these four threw
`ReferenceError: <name> is not defined` and `form_submission` never fired at all.

## CDN cache — action needed

The origin is correct; the CDN edge is not yet serving it:

```
plain URL        -> 8194ecd3…   (pre-A21, cached)
?cachebust=…     -> 1e48b2de…   (the deployed file)
cache-control: public, max-age=604800
last-modified: Fri, 18 Sep 2026 12:36:29 GMT
```

`max-age` is 7 days, so **Swastik must clear the Hostinger cache (hPanel →
Clear cache)** before real visitors get the fix. Until then the live page still
throws the four ReferenceErrors and still does not record `form_submission`.
Steps 5 and 6 above were run with `CACHE_BUST=1`, which reads the deployed bytes
past the stale edge copy; they must be re-run without it after the purge.

## Step 7 — rollback, ready, not run

```bash
ssh -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4 \
  "cd ~/domains/ankuramtuition.com && tar -xzf ~/backups/public_html-pre-a21-20260918-125111.tar.gz public_html/js/contact-whatsapp.js && cd public_html && sha256sum js/contact-whatsapp.js"
# must print 8194ecd351ce7ba6815014c267a5949cf444219d5d84b13d197bbfae93eb0981
```

Restores only that one file. Nothing else on the site is touched.

---

# A22 + A23 deploy — 19 September 2026

Two files, one write: `index.html` and `js/contact-whatsapp.js`.
`css/site.css` was **not** re-uploaded — its local hash already matched the
server's (`451d14a5…`), and it kept its Sep 18 10:09 timestamp throughout.

## Step 1 — backup

`~/backups/public_html-pre-a22a23-20260919-075146.tar.gz`, 1.5M, 194 entries,
verified to contain `index.html`, `js/contact-whatsapp.js` and `css/site.css`.

## Steps 2 and 4 — hashes before and after

| file | before | after | |
|---|---|---|---|
| `.htaccess` | `4587cf66…` | `4587cf66…` | unchanged |
| `robots.txt` | `43ed0d0e…` | `43ed0d0e…` | unchanged |
| `sitemap.xml` | `6d9d9940…` | `6d9d9940…` | unchanged |
| `styles.css` | `c75ae294…` | `c75ae294…` | unchanged |
| `script.js` | `1bf4f312…` | `1bf4f312…` | unchanged |
| `css/site.css` | `451d14a5…` | `451d14a5…` | unchanged, not uploaded |
| `index.html` | `34e1f1f1…` | **`0b01cab1…`** | changed |
| `js/contact-whatsapp.js` | `1e48b2de…` | **`5f7ccd03…`** | changed |

Both new hashes equal the local `build/production` files. Uploaded JS first,
`index.html` last, no `--delete`.

Deployed asset references:

```
href="css/site.css?v=451d14a5"
src="js/contact-whatsapp.js?v=5f7ccd03"
```

## A23 — did the query string actually solve the edge problem?

**Yes.** `mum-edge5` and `mum-edge8` are the two PoPs that served a stale asset
through two manual purges. On the versioned URLs, both serve the current file:

```
js/contact-whatsapp.js?v=5f7ccd03      expected 5f7ccd03
  mum-edge10  5f7ccd03 CURRENT  HIT  age=146   12237 B
  mum-edge8   5f7ccd03 CURRENT  HIT  age=148   12237 B
  mum-edge5   5f7ccd03 CURRENT  HIT  age=150   12237 B
  mum-edge7   5f7ccd03 CURRENT  HIT  age=156   12237 B
  mum-edge4   5f7ccd03 CURRENT  MISS age=none  12237 B
  mum-edge6   5f7ccd03 CURRENT  HIT  age=155   12237 B
  stale responses: 0

css/site.css?v=451d14a5                expected 451d14a5
  all six nodes CURRENT, including mum-edge5 and mum-edge8
  stale responses: 0
```

Every `age` is ~150s, i.e. populated after this deploy rather than inherited
from an old object. `index.html` is served `DYNAMIC` (never edge-cached) and
returned `0b01cab1` from all six nodes across 10 fresh connections.

**Sixteen live homepage loads with no cache-busting of any kind: 16 / 16 with
zero console errors and all four handlers resolving.** Before A23 this was
roughly 70%, and 1 in 6 for a full browser session.

**No Hostinger cache purge is needed.** That is the result A23 was for.

## Live verification, mobile UA, wa.me and all beacons blocked

All four inline handlers `typeof=function`.

| grade | curricula |
|---|---|
| blank | 9 — CBSE · IB PYP · IB MYP · IGCSE · ICSE · ISC · IB DP · AS & A Levels · State Board |
| Grades 1-5 | 4 — CBSE · IB PYP · ICSE · State Board |
| Grades 6-10 | 5 — CBSE · IB MYP · IGCSE · ICSE · State Board |
| Grades 11-12 | 5 — CBSE · ISC · IB DP · AS & A Levels · State Board |

Grades 1-5 + IB PYP submitted:

```
"Hi Swastik, I'd like to enquire about tuition.
Name: Test Parent
Phone: 9876543210
Grade: Grades 1-5
Curriculum: IB PYP"
```

GA4 `form_submission` 1 · dataLayer `form_submission` 1 · Ads
`jucWCNPv3OAbEPOvruco` 1 · conversion events of any label 1 · ReferenceErrors 0.

tel: link — `phone_call_click` 1, `NGIFCNbv3OAbEPOvruco` 1, any-label 1.
wa.me link — `whatsapp_click` 1, `jucWCNPv3OAbEPOvruco` 1, any-label 1.
CTA link — `cta_click` 1, and no Ads conversion, which is correct: the
get-directions link is neither a `tel:` nor a `wa.me` link.

Nothing fires twice anywhere.

## Rollback — ready, not run

```bash
ssh -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4 \
  "cd ~/domains/ankuramtuition.com && tar -xzf ~/backups/public_html-pre-a22a23-20260919-075146.tar.gz public_html/index.html public_html/js/contact-whatsapp.js && cd public_html && sha256sum index.html js/contact-whatsapp.js"
# must print 34e1f1f1…  index.html  and  1e48b2de…  js/contact-whatsapp.js
```

Restores only those two files. `css/site.css` and everything else are untouched.
Note that a rollback also reverts the A23 versioned references, so the old
`js/contact-whatsapp.js` (no query string) would be served from whatever the
edge holds — the pre-A23 behaviour.

---

# A24 + A25 + A25.1 production deploy — PREPARED, NOT RUN

Awaiting approval. One write covering all three changes.

## Files that change — TWO, not three

| remote path | on the server now | to deploy | |
|---|---|---|---|
| `public_html/index.html` | `0b01cab1d189fb73f50d6812ca04ab5a521cac00d84eac247d49d7139b6807dd` | `129ad4ff0b43422e77205b93ca6bfaee84dc79fa259fc76aeb4fa4675ca47bbe` | CHANGES |
| `public_html/css/site.css` | `451d14a591a3c39ca50bb3d1b9b3df5fb16cce80a453997c79bddbea92575949` | `59085e0ff8512ed85db83fca3218999211266c9fa117d042ff6006422f6a1395` | CHANGES |
| `public_html/js/contact-whatsapp.js` | `5f7ccd037099426518dfee5f30e444e56f606f26495dd4866370fd7b705cbbd9` | identical | **DO NOT UPLOAD** |

`css/site.css` changes because A25 added the fold and set styling and A25.1
deleted both dead `.curricula-line` rules. `js/contact-whatsapp.js` is untouched
by A24/A25/A25.1 — the JS change was A22's grade filter, already live.

Under A23 the page will reference `css/site.css?v=59085e0f`, a cache key no edge
node has seen, so the stylesheet cannot be served stale.

## Not touched

`.htaccess`, `robots.txt`, `sitemap.xml`, `styles.css`, `script.js`,
`js/contact-whatsapp.js`, and every other page. No `rsync --delete`.

## Steps

```bash
SSH_OPTS="-p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3"
SSH_HOST="u879191658@145.79.212.4"
SITE="domains/ankuramtuition.com"

# 1. backup
ssh $SSH_OPTS $SSH_HOST "mkdir -p ~/backups && cd ~/$SITE && tar -czf ~/backups/public_html-pre-a24a25-\$(date +%Y%m%d-%H%M%S).tar.gz public_html && ls -lh ~/backups/public_html-pre-a24a25-*.tar.gz"
ssh $SSH_OPTS $SSH_HOST "cd ~/backups && ls -t public_html-pre-a24a25-*.tar.gz | head -1 | xargs -I{} tar -tzf {} public_html/index.html public_html/css/site.css"

# 2. fingerprint BEFORE
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && sha256sum .htaccess robots.txt sitemap.xml index.html styles.css script.js css/site.css js/contact-whatsapp.js"

# 3. upload — stylesheet first, index.html last, no --delete
rsync -avz --checksum -e "ssh $SSH_OPTS" build/production/css/site.css $SSH_HOST:$SITE/public_html/css/site.css
rsync -avz --checksum -e "ssh $SSH_OPTS" build/production/index.html   $SSH_HOST:$SITE/public_html/index.html

# 4. fingerprint AFTER — only index.html and css/site.css may differ
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && sha256sum .htaccess robots.txt sitemap.xml index.html styles.css script.js css/site.css js/contact-whatsapp.js"

# 5. server-side content checks
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE/public_html && \
  echo '--- versioned refs:' && grep -o 'css/site.css?v=[0-9a-f]*' index.html && grep -o 'js/contact-whatsapp.js?v=[0-9a-f]*' index.html && \
  echo '--- the band must be GONE (expect 0):' && grep -c 'curricula-line' index.html; \
  echo '--- every board name, none may be 0:' && for b in CBSE ICSE ISC IGCSE 'IB PYP' 'IB MYP' 'IB DP' 'State Board'; do printf '%s ' \"\$b\"; grep -c \"\$b\" index.html; done; \
  echo '--- id=curricula:' && grep -c 'id=\"curricula\"' index.html"
```

## Post-deploy

Run `node design/check-inline-handlers.mjs https://ankuramtuition.com/` and
`node design/verify-live-a22.mjs` with no cache-busting. Both must be clean on
every load; A23 means no Hostinger purge should be needed.

## Rollback

```bash
ssh $SSH_OPTS $SSH_HOST "cd ~/$SITE && tar -xzf \$(ls -t ~/backups/public_html-pre-a24a25-*.tar.gz | head -1) public_html/index.html public_html/css/site.css && cd public_html && sha256sum index.html css/site.css"
# must print 0b01cab1… index.html  and  451d14a5… css/site.css
```

---

# A24 + A25 + A25.1 + A25.2 deploy — EXECUTED 19 September 2026

Two files, one write. `js/contact-whatsapp.js` was NOT uploaded: identical at
`5f7ccd03…`, and it kept its Sep 19 07:40 timestamp.

## Step 1 — backup

`~/backups/public_html-pre-a24a25-20260919-170647.tar.gz`, 1.5M, 194 entries,
verified to contain `index.html`, `css/site.css` and `js/contact-whatsapp.js`.

## Steps 2 and 4 — hashes before and after

| file | before | after | |
|---|---|---|---|
| `.htaccess` | `4587cf66…` | `4587cf66…` | unchanged |
| `robots.txt` | `43ed0d0e…` | `43ed0d0e…` | unchanged |
| `sitemap.xml` | `6d9d9940…` | `6d9d9940…` | unchanged |
| `styles.css` | `c75ae294…` | `c75ae294…` | unchanged |
| `script.js` | `1bf4f312…` | `1bf4f312…` | unchanged |
| `js/contact-whatsapp.js` | `5f7ccd03…` | `5f7ccd03…` | unchanged, not uploaded |
| `index.html` | `0b01cab1…` | **`cfe08857…`** | changed |
| `css/site.css` | `451d14a5…` | **`ca460165…`** | changed |

Both new hashes equal the local `build/production` files. Stylesheet uploaded
first, `index.html` last, no `--delete`.

A23 after the A25.2 edit: the stylesheet hash moved `59085e0f -> ca460165` and
the page references `css/site.css?v=ca460165`, matching the deployed file. The
build fails if they disagree; it did not.

Server-side content checks: hero band occurrences **0**, `id="curricula"` **1**.

## A23 at the edge — first test on a CSS change

```
css/site.css?v=ca460165                 expected ca460165
  mum-edge5   ca460165 CURRENT  MISS   61630 B     <- previously stale node
  mum-edge9   ca460165 CURRENT  MISS   61630 B
  mum-edge7   ca460165 CURRENT  MISS   61630 B
  mum-edge8   ca460165 CURRENT  MISS   61630 B     <- previously stale node
  mum-edge4   ca460165 CURRENT  MISS   61630 B
  mum-edge10  ca460165 CURRENT  MISS   61630 B
  7 requests, 6 distinct nodes, stale responses: 0
```

Every node reported MISS, i.e. the new cache key forced a fresh origin fetch
everywhere rather than serving anything held from before.

**Sixteen live homepage loads, no cache-busting: 16 / 16 clean.**

**No Hostinger purge was needed, and none was performed.**

## Live verification, mobile UA, wa.me and beacons blocked

Board-name counts: CBSE 18, ICSE 16, ISC 10, IGCSE 17, IB PYP 5, IB MYP 8,
IB DP 5, AS & A Levels 9, State Board 12 — none zero. Hero band absent.
`id="curricula"` present. All six anchor ids present. Four inline handlers
`typeof=function`. No console errors.

Curricula fold, with JavaScript ENABLED and DISABLED: starts closed, opens,
closes, 9 chips, sets `["International","Indian"]`, no page errors.

Grade lists all match. Grades 1-5 + IB PYP submits with "Curriculum: IB PYP".
GA4 `form_submission` 1, dataLayer 1, Ads `jucWCNPv3OAbEPOvruco` 1, any-label 1.
tel: `phone_call_click` 1 + `NGIFCNbv3OAbEPOvruco` 1. wa.me `whatsapp_click` 1 +
`jucWCNPv3OAbEPOvruco` 1. CTA `cta_click` 1 with no Ads conversion, correct.
Nothing fires twice.

## Rollback — ready, not run

```bash
ssh -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4 \
  "cd ~/domains/ankuramtuition.com && tar -xzf ~/backups/public_html-pre-a24a25-20260919-170647.tar.gz public_html/index.html public_html/css/site.css && cd public_html && sha256sum index.html css/site.css"
# must print 0b01cab1…  index.html  and  451d14a5…  css/site.css
```

Restores only those two files. `js/contact-whatsapp.js` is untouched either way.
A rollback also reverts the A23 version string to `?v=451d14a5`, a key the edge
already holds, so the old stylesheet would be served immediately.
