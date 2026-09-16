# Staging setup — staging.ankuramtuition.com

One-time setup. Swastik does part A and part B; I do nothing on the server
until both are done and confirmed.

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
   - Leave **Custom folder for subdomain** unticked. Hostinger will create
     `domains/staging.ankuramtuition.com/public_html` by itself, which is the
     path the deploy script expects.
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

3. **If `htpasswd` exists** — create the password file one level *above*
   `public_html`, so it can never be served over HTTP:

   ```
   htpasswd -c ~/domains/staging.ankuramtuition.com/.htpasswd ankuram
   ```

   It will prompt `New password:` and then `Re-type new password:`. Nothing you
   type is echoed to the screen. `-c` creates the file; use it only this once,
   because `-c` overwrites an existing file.

4. **If `htpasswd` does not exist** — use OpenSSL, which is always present:

   ```
   printf 'ankuram:' > ~/domains/staging.ankuramtuition.com/.htpasswd
   openssl passwd -apr1 >> ~/domains/staging.ankuramtuition.com/.htpasswd
   ```

   The second command prompts for the password twice and appends only the
   hash. Check the result looks like `ankuram:$apr1$...` with:

   ```
   cut -c1-20 ~/domains/staging.ankuramtuition.com/.htpasswd
   ```

5. Lock the file down and confirm its location:

   ```
   chmod 640 ~/domains/staging.ankuramtuition.com/.htpasswd
   ls -l ~/domains/staging.ankuramtuition.com/.htpasswd
   ```

   The path must end `staging.ankuramtuition.com/.htpasswd` and must **not**
   contain `public_html`. If it does, move it up one level and tell me.

6. Log out (`exit`) and tell me **"staging password is set"** — those words
   only, nothing else about it.

---

## What I do next

Once you confirm both parts:

1. I run `bash scripts/deploy-staging.sh dist/`, which rsyncs the build (no
   `--delete`), writes the staging `.htaccess` with
   `AuthUserFile` pointing at the file you created, adds
   `X-Robots-Tag: noindex, nofollow`, and writes a `robots.txt` containing
   `Disallow: /`.
2. I verify on the server with `grep`, not over HTTP, because the CDN caches.
3. I check from outside that an unauthenticated request returns **401**, that
   the `X-Robots-Tag` header is present, and that the **live** site still
   returns 200 and is unchanged.

If step 3 shows anything other than 401, I stop and tell you before any page
goes further.

---

## If you ever need to change the password

Repeat Part B without `-c` (it would wipe the file and lock everyone out):

```
htpasswd ~/domains/staging.ankuramtuition.com/.htpasswd ankuram
```

No redeploy is needed; `.htaccess` reads the file on every request.
