# AutoDetailingSites.com

A lightweight, one-page static landing page for AutoDetailingSites.com.

## Files

- `index.html` contains the page content, SEO metadata, Open Graph tags, Twitter/X tags, and JSON-LD structured data.
- `thank-you.html` is the Netlify Forms success page.
- `privacy.html` contains the starter Privacy Policy.
- `terms.html` contains the starter Terms of Service.
- `styles.css` contains all styling.
- `script.js` contains lightweight scroll reveal behavior.
- `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, and `site.webmanifest` provide browser tab and app icons.
- `og-image.jpg` is the 1200x630 social sharing image used by Open Graph and Twitter/X metadata.
- `assets/` contains optimized display images, including WebP variants for the hero and demo screenshots with JPG fallbacks.
- `robots.txt` allows crawling and points search engines to the sitemap.
- `sitemap.xml` lists the homepage, privacy policy, and terms pages.

## Editing

Update the main page copy in `index.html`.

Update colors, spacing, and layout rules in `styles.css`. The site uses system fonts and no external CSS framework.

The review forms use Netlify Forms with the form name `website-review`.

## Deployment

Upload these files to the web root of the domain:

- `index.html`
- `thank-you.html`
- `privacy.html`
- `terms.html`
- `styles.css`
- `script.js`
- `favicon.ico`
- `favicon.svg`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`
- `site.webmanifest`
- `og-image.jpg`
- `robots.txt`
- `sitemap.xml`

The canonical URL and sitemap currently point to:

```text
https://autodetailingsites.com/
```

After deployment, test the live page on mobile and desktop, then submit the sitemap in Google Search Console.

## Netlify Forms

After deployment on Netlify, go to Forms/Notifications and add an email notification for the `website-review` form to `kevingoncalo@gmail.com`.

Netlify email notifications are configured in:

```text
Project/Site configuration > Notifications > Form submission notifications
```
