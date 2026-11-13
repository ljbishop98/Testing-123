# Knack for Creativity Photo — website

Kim's portfolio site. Static site (Eleventy) hosted free on Netlify, with an admin panel at `/admin` where Kim logs in to add galleries, swap photos, update packages and paste her HoneyBook form.

The only cost is the domain (about $10–20/year).

## Go live (about 20 minutes, one time)

1. **GitHub** — Create a free account (or use yours) and a new repo, e.g. `knack-site`. Upload everything in this folder except `node_modules` and `_site` (drag-and-drop on github.com works, or `git push`).
2. **Netlify** — Sign up free at netlify.com with GitHub → **Add new project → Import from Git** → pick the repo. Build settings fill in from `netlify.toml` (build: `npm run build`, publish: `_site`). Click **Deploy**. You now have a live link like `knack-site.netlify.app`.
3. **Turn on the admin login** — In the Netlify project:
   - **Project configuration → Identity → Enable Identity**
   - Under Identity **Registration**, set to **Invite only**
   - Under **Services → Git Gateway**, click **Enable Git Gateway**
   - **Identity → Invite users** → enter Kim's email
4. **Kim accepts the invite** — The email link opens the site, she sets a password, and lands in the admin. From then on she logs in at `yoursite.com/admin`.
5. **Domain** — Buy it (Cloudflare, Porkbun or Namecheap). In Netlify: **Domain management → Add a domain**, then add the DNS records Netlify shows at the registrar. HTTPS turns on automatically.
6. **HoneyBook** — In HoneyBook, open the contact form → **Publish → Copy code**. In the admin: **Home page → Cover, contact & HoneyBook**, paste the form link (and optionally the embed code), **Publish**.

## How Kim uses the admin

- **Galleries → New Gallery**: title, category, date, cover photo, then drag in several photos at once. **Publish** and the site updates in about a minute.
- **Home page**: the cover photo and intro, the "How your day will look" chapters and their photos, starting prices, films, and the HoneyBook link that every Inquire button uses.
- Export photos for web before uploading (about 2000px on the long edge, JPG/WebP). Full-resolution files make the site slow and the repo heavy.

## Starter content

The starter galleries point to photos still hosted on her SmugMug, so the site looks finished on day one. Before cancelling SmugMug, re-upload those photos through the admin (each gallery's Cover and Photos fields), or they will disappear.

Check before launch: the Instagram handle and email in **Site settings**, and the shoot dates on the starter galleries (some are approximate).

## Testing before anything goes live (costs no Netlify credits)

**Preview the site on your Mac**
```
npm install      # once
npm start        # site at http://localhost:8080, refreshes as you edit
```

**Try the admin on your Mac** (edits your local files; no login, nothing published)
```
npm run admin    # then open http://localhost:8080/admin/
```
When you're happy, push as usual (`git add -A`, `git commit -m "..."`, `git push`).

**Drafts in the live admin**
The admin runs in draft mode: **Save** keeps a draft (the live site doesn't change and it costs no credits). In the **Workflow** tab, move a draft to **Ready**, then **Publish**. Each Publish is one Netlify deploy (15 credits).

**Optional: a free staging copy online**
Netlify branch deploys cost 0 credits. Once, in Netlify: *Project configuration → Build & deploy → Branches and deploy contexts → Branch deploys → Let me add individual branches → `staging`*. Then:
```
git checkout -b staging      # first time only (afterwards: git checkout staging)
git push -u origin staging   # staging--YOUR-SITE.netlify.app
```
When it looks right: `git checkout main && git merge staging && git push`.

## Run locally (optional)

```
npm install
npm start      # http://localhost:8080
```
