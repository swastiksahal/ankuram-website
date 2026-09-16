# Staging setup — staging.ankuramtuition.com

**Status: done, 17 Sep 2026.** Kept as the record of how staging is wired.

Swastik created the subdomain and set the password himself.

**The password is yours alone.** You type it, you keep it. I never ask for it,
never store it, never print it, and it must never appear in this chat, in a
commit, or in a script. `scripts/deploy-staging.sh` is written so that it
cannot read or create it.

---

## Part A — create the subdomain in hPanel

1. Sign in to **hPanel** at `hpanel.hostinger.com`.
2. Open **Websites** in the top bar, find **ankuramtuition.com**, click
   **Manage**. You are now in the dashboard for that hosting plan.
3. In the left sidebar choose **Domains → Subdomains**.
4. In **Create a new subdomain**:
   - **Subdomain**: type `staging`
   - **Domain**: choose `ankuramtuition.com`
   - Leave **Custom folder for subdomain** unticked.

   **What actually happened:** Hostinger did *not* create a separate
   `domains/staging.ankuramtuition.com/` tree. It put the subdomain's document
   root **inside the live site**, at
   `~/domains/ankuramtuition.com/public_html/staging`. There is no
   `~/domains/staging.ankuramtuition.com` directory at all.

   That has one consequence that matters: the folder is reachable by **two**
   routes, not one —

   | Route | Why |
   |---|---|
   | `https://staging.ankuramtuition.com/` | it is the subdomain's document root |
   | `https://ankuramtuition.com/staging/` | it is also just a folder in the live site |

   So the staging `.htaccess` has to carry the basic auth and the noindex
   header **itself**, and cannot rely on anything inherited. That is how
   `scripts/deploy-staging.sh` writes it.
5. Click **Create**. Wait for `staging.ankuramtuition.com` to appear in the
   list below the form.
6. Still in the sidebar, go to **Security → SSL**.
7. Find `staging.ankuramtuition.com` in the list and click **Install SSL**
   (on some plans this is **Set up** or it issues automatically). Wait until
   its status reads **Active**. Do not continue until it does — without SSL the
   basic-auth password would travel in clear text.
8. Open `https://staging.ankuramtuition.com` in a private window. An empty
   directory listing, a blank page or a Hostinger placeholder is the expected
   result at this stage. If you get a certificate warning, SSL is not ready yet
   — wait and retry.
9. Tell me the subdomain is created. **Do not tell me any password.**

---

## Part B — set the password yourself, over SSH

Do this in your own terminal. Type `! <command>` in the Claude Code prompt if
you want the output visible here — but **not for the two commands that contain
the password** (steps 3 and 4). Run those in a plain terminal window.

1. Connect:

   ```
   ssh -p 65002 u879191658@145.79.212.4
   ```

2. Check whether `htpasswd` is available:

   ```
   which htpasswd
   ```

   If it prints a path, use step 3. If it prints nothing, use step 4 instead.

3. **If `htpasswd` exists** — create the password file *outside*
   `public_html`, so it can never be served over HTTP:

   ```
   htpasswd -c ~/domains/ankuramtuition.com/.htpasswd-staging ankuram
   ```

   It will prompt `New password:` and then `Re-type new password:`. Nothing you
   type is echoed to the screen. `-c` creates the file; use it only this once,
   because `-c` overwrites an existing file.

4. **If `htpasswd` does not exist** — use OpenSSL, which is always present:

   ```
   printf 'ankuram:' > ~/domains/ankuramtuition.com/.htpasswd-staging
   openssl passwd -apr1 >> ~/domains/ankuramtuition.com/.htpasswd-staging
   ```

   The second command prompts for the password twice and appends only the
   hash. Check the result looks like `ankuram:$apr1$...` with:

   ```
   cut -c1-20 ~/domains/ankuramtuition.com/.htpasswd-staging
   ```

5. Lock the file down and confirm its location:

   ```
   chmod 640 ~/domains/ankuramtuition.com/.htpasswd-staging
   ls -l ~/domains/ankuramtuition.com/.htpasswd-staging
   ```

   The path must **not** contain `public_html`. If it does, move it up one
   level and tell me.

   **As it stands the file is mode 644, not 640.** It is outside `public_html`
   so it is never served over HTTP, and the hash is bcrypt/apr1 rather than a
   plaintext password — but on shared hosting 640 is tighter. Your call; I have
   deliberately not touched it.

6. Log out (`exit`) and tell me **"staging password is set"** — those words
   only, nothing else about it.

---

## What I do next

Once you confirm both parts:

1. I run `bash scripts/deploy-staging.sh build/staging`, which rsyncs the build
   (no `--delete`) into `~/domains/ankuramtuition.com/public_html/staging`,
   writes the staging `.htaccess` with `AuthUserFile
   /home/u879191658/domains/ankuramtuition.com/.htpasswd-staging`, adds
   `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`, and writes a
   `robots.txt` containing `Disallow: /`. It records the SHA-256 of the live
   `.htaccess`, `robots.txt`, `sitemap.xml` and `index.html` before and after,
   so any change to the live site would show up immediately.
2. I verify on the server with `grep`, not over HTTP, because the CDN caches.
3. I check from outside that an unauthenticated request returns **401** on
   **both** routes, that the `X-Robots-Tag` header is present on both, and that
   the **live** site still returns 200 with an unchanged title.

If step 3 shows anything other than 401, I stop and tell you before any page
goes further.

---

## If you ever need to change the password

Repeat Part B without `-c` (it would wipe the file and lock everyone out):

```
htpasswd ~/domains/ankuramtuition.com/.htpasswd-staging ankuram
```

No redeploy is needed; `.htaccess` reads the file on every request.
