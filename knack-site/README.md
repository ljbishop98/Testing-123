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
6. **HoneyBook** — In HoneyBook, open the contact form → **Publish → Copy code**. In the admin: **Site pages → Site settings & HoneyBook → HoneyBook embed code**, paste, **Publish**. It shows on the Contact page.

## How Kim uses the admin

- **Galleries → New Gallery**: title, category, date, cover photo, then add photos. Tick "Feature on home page" to show it on the homepage (three looks best). **Publish** → the site updates in about a minute.
- **Site pages**: About text and portrait, packages and prices, contact details, home hero photo, HoneyBook code.
- Export photos for web before uploading (about 2000px on the long edge, JPG/WebP). Full-resolution files make the site slow and the repo heavy.

## Starter content

The eight starter galleries point to photos still hosted on her SmugMug, so the site looks finished on day one. Before cancelling SmugMug, re-upload those photos through the admin (each gallery's Cover and Photos fields), or they will disappear.

Check before launch: the Instagram handle and email in **Site settings**, and the shoot dates on the starter galleries (some are approximate).

## Run locally (optional)

```
npm install
npm start      # http://localhost:8080
```
