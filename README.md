# AutoDetailingSites.com

A static marketing site for a flat-rate $1,500 website service aimed at auto detailers. Netlify hosts it and handles the review form. No build step is required to publish.

## Pages

- `/` Home. Offer, price, and the SEI Auto Detailing proof.
- `/portfolio/` SEI Auto Detailing, plus two fictional sample concepts labeled as concepts.
- `/pricing/` What $1,500 includes, what is not included, and the open decisions.
- `/about/` Kevin Goncalo.
- `/contact/` Review form. Website URL is optional.
- `/orlando-detailing-websites/`, `/tampa-detailing-websites/`, `/providence-detailing-websites/`
- `/blog/` and three articles.
- `/privacy/`, `/terms/`, `/thank-you/`
- `404.html`

Old `/privacy.html`, `/terms.html`, and `/thank-you.html` URLs redirect to the new paths. See `netlify.toml`.

## Edit the HTML

Change copy in the page you mean to change. Shared pieces (header, footer, analytics) are repeated in each HTML file so the site can deploy as plain files.

`scripts/build.mjs` regenerates the HTML from one template. Running it overwrites the pages. Use it only for a layout or tracking change, and do not run it after filling the placeholders in [CHECKLIST.md](CHECKLIST.md).

Search the repository for `TODO`. That list is the photo, city, bio, domain email, phone, calendar link, care plan price, SEI testimonial, and hosting decision.

## Tracking

Every page includes:

- Google Analytics `G-LGBZE8QP5E`
- Meta pixel `973776965424046`

## Forms

Both review forms use Netlify Forms with the name `website-review`, post to `/thank-you/`, and use the honeypot field `company_website`.

Notification setup is in [CHECKLIST.md](CHECKLIST.md). Send form mail to `kevingoncalo@gmail.com` until a domain email replaces it.

## Deploy

Publish the repository root. `netlify.toml` sets that directory and adds redirects and basic headers. Connect the GitHub repo in Netlify if it is not already connected. Pull requests then get a deploy preview when Netlify's continuous deployment is enabled for the site. This branch does not change production until it is merged.

After a production deploy, submit `sitemap.xml` in Google Search Console. Canonical URLs use `https://autodetailingsites.com/`.

## Preview locally

From this folder:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. On Windows, `preview-server.ps1` serves the same files on port 4173 and understands folder index pages.

A static server will not deliver Netlify form email. It can still show the thank-you page if you open `/thank-you/` directly. Submit a real test on the Netlify deploy.
