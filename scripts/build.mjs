// Regenerates the HTML pages. Running this overwrites hand edits in those files.
// After filling the TODOs in CHECKLIST.md, do not run this script.
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SITE = "https://autodetailingsites.com";
const DATE = "2026-11-11";

const tracking = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LGBZE8QP5E"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-LGBZE8QP5E');
    </script>
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '973776965424046');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=973776965424046&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->`;

const instagramSvg = `<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg>`;

const NAV = [
  ["portfolio", "/portfolio/", "Portfolio"],
  ["pricing", "/pricing/", "Pricing"],
  ["about", "/about/", "About"],
  ["blog", "/blog/", "Blog"],
  ["contact", "/contact/", "Contact"]
];

function navAnchors(active) {
  return NAV.map(([key, href, label]) => {
    const current = key === active ? ` aria-current="page"` : "";
    return `<a href="${href}"${current}>${label}</a>`;
  }).join("\n            ");
}

function ext(href, label) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
}

function jsonScript(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function reviewForm(location, prefix) {
  return `<form class="review-form" name="website-review" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="company_website">
              <input type="hidden" name="form-name" value="website-review">
              <input type="hidden" name="form-location" value="${location}">
              <input type="hidden" name="subject" value="New website review request from AutoDetailingSites.com">
              <p class="hp">
                <label>Company website <input name="company_website" tabindex="-1" autocomplete="off" maxlength="200"></label>
              </p>
              <div class="form-field">
                <label for="${prefix}-name">Name</label>
                <input id="${prefix}-name" name="name" type="text" autocomplete="name" maxlength="80" required>
              </div>
              <div class="form-field">
                <label for="${prefix}-business">Business name</label>
                <input id="${prefix}-business" name="business-name" type="text" autocomplete="organization" maxlength="120" required>
              </div>
              <div class="form-field">
                <label for="${prefix}-email">Email</label>
                <input id="${prefix}-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="120" required>
              </div>
              <div class="form-field">
                <label for="${prefix}-phone">Phone <span class="optional">(optional)</span></label>
                <input id="${prefix}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40">
              </div>
              <fieldset class="choice-list">
                <legend>Do you have a website?</legend>
                <label><input type="radio" name="site-status" value="I have a website" required> I have a website</label>
                <label><input type="radio" name="site-status" value="I don't have a site yet"> I don't have a site yet</label>
                <label><input type="radio" name="site-status" value="I only use Facebook or Instagram"> I only use Facebook or Instagram</label>
              </fieldset>
              <div class="form-field">
                <label for="${prefix}-website">Website, Facebook, or Instagram link <span class="optional">(optional)</span></label>
                <input id="${prefix}-website" name="website-url" type="text" inputmode="url" maxlength="200" placeholder="https://">
                <p class="field-hint">Leave this blank if you don't have a link yet. A website URL is not required.</p>
              </div>
              <div class="form-field">
                <label for="${prefix}-message">What are you trying to improve? <span class="optional">(optional)</span></label>
                <textarea id="${prefix}-message" name="improvement-message" rows="4" maxlength="1000"></textarea>
                <p class="field-hint">1,000 characters max.</p>
              </div>
              <button class="button button-primary full-width" type="submit">Request my review</button>
              <p class="form-note">The review is free. You can stop there.</p>
            </form>`;
}

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="nav container" aria-label="Primary">
        <a class="brand" href="/" aria-label="AutoDetailingSites.com home">
          <img src="/assets/autodetailingsites-logo-640.png" alt="" width="640" height="74" decoding="async">
        </a>
        <div class="nav-links">
            ${navAnchors(active)}
        </div>
        <div class="nav-tools">
          <a class="social-link" href="https://www.instagram.com/autodetailingsites" target="_blank" rel="noopener noreferrer" aria-label="AutoDetailingSites on Instagram">
            ${instagramSvg}
          </a>
          <details class="nav-drawer">
            <summary class="menu-button"><span class="menu-bars" aria-hidden="true"></span> Menu</summary>
            <div class="nav-drawer-panel">
              ${navAnchors(active)}
            </div>
          </details>
          <a class="button button-primary nav-cta" href="/contact/">Free Review</a>
        </div>
      </nav>
    </header>`;
}

function footer() {
  return `<footer class="site-footer">
      <div class="container footer-layout">
        <div class="footer-brand">
          <a href="/" aria-label="AutoDetailingSites.com home">
            <img src="/assets/autodetailingsites-logo-640.png" alt="" width="640" height="74" decoding="async">
          </a>
          <p>Flat-rate websites for auto detailers. $1,500. Built to make services clear and quote requests easy.</p>
          <a class="footer-social-link" href="https://www.instagram.com/autodetailingsites" target="_blank" rel="noopener noreferrer">
            ${instagramSvg}
            <span>@autodetailingsites</span>
          </a>
        </div>
        <div>
          <p class="footer-heading">Site</p>
          <ul>
            <li><a href="/portfolio/">Portfolio</a></li>
            <li><a href="/pricing/">Pricing</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">For detailers in</p>
          <ul>
            <li><a href="/orlando-detailing-websites/">Orlando, FL</a></li>
            <li><a href="/tampa-detailing-websites/">Tampa Bay, FL</a></li>
            <li><a href="/providence-detailing-websites/">Providence, RI</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">From the blog</p>
          <ul>
            <li><a href="/blog/quote-requests/">More quote requests</a></li>
            <li><a href="/blog/what-a-detailing-website-needs/">What a site needs</a></li>
            <li><a href="/blog/google-business-profile-for-detailers/">Google Business Profile</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; 2026 AutoDetailingSites.com</p>
        <div class="footer-legal">
          <a href="/privacy/">Privacy Policy</a>
          <a href="/terms/">Terms of Service</a>
        </div>
      </div>
    </footer>`;
}

function crumbsHtml(crumbs, current) {
  if (!current) return "";
  const parts = [`<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>`];
  for (const crumb of crumbs || []) {
    parts.push(`<span aria-hidden="true">/</span><a href="${crumb.href}">${crumb.label}</a>`);
  }
  parts.push(`<span aria-hidden="true">/</span><span aria-current="page">${current}</span></nav>`);
  return parts.join("");
}

function breadcrumbSchema(url, crumbs, current) {
  const items = [{ name: "Home", item: `${SITE}/` }];
  for (const crumb of crumbs || []) items.push({ name: crumb.label, item: SITE + crumb.href });
  items.push({ name: current, item: SITE + url });
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

function render(page) {
  const canonical = SITE + page.url;
  const robots = page.robots || "index, follow";
  const schemas = page.schemas || [];
  if (page.crumbLabel) schemas.push(breadcrumbSchema(page.url, page.crumbs, page.crumbLabel));
  const schemaBlock = schemas.length
    ? jsonScript({ "@context": "https://schema.org", "@graph": schemas })
    : "";
  const articleMeta = page.ogType === "article"
    ? `<meta property="article:published_time" content="${DATE}">
    <meta property="article:modified_time" content="${DATE}">
    <meta property="article:author" content="Kevin Goncalo">`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    ${tracking}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${page.ogType || "website"}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="AutoDetailingSites.com">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${SITE}/og-image.jpg">
    <meta property="og:image:secure_url" content="${SITE}/og-image.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="AutoDetailingSites.com. Websites for auto detailers, built around clear services and quote requests.">
    ${articleMeta}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${SITE}/og-image.jpg">
    <meta name="twitter:image:alt" content="AutoDetailingSites.com. Websites for auto detailers, built around clear services and quote requests.">
    <meta name="robots" content="${robots}">
    <meta name="theme-color" content="#070B10">
    <link rel="icon" href="/favicon.ico?v=2" sizes="any">
    <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;family=Sora:wght@600;700;800&amp;display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;family=Sora:wght@600;700;800&amp;display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;family=Sora:wght@600;700;800&amp;display=swap"></noscript>
    <link rel="stylesheet" href="/styles.css">
    ${page.extraHead || ""}
    ${schemaBlock}
  </head>
  <body>
    ${header(page.active || "")}
    <main id="main">
      ${page.body}
    </main>
    ${footer()}
    <script src="/script.js" defer></script>
  </body>
</html>
`;
}

const homeSchema = [
  {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: "AutoDetailingSites.com",
    inLanguage: "en-US",
    publisher: { "@id": `${SITE}/#business` }
  },
  {
    "@type": "ProfessionalService",
    "@id": `${SITE}/#business`,
    name: "AutoDetailingSites.com",
    url: `${SITE}/`,
    image: `${SITE}/og-image.jpg`,
    logo: `${SITE}/assets/autodetailingsites-logo-640.png`,
    description: "Flat-rate websites for auto detailers in the United States.",
    email: "kevingoncalo@gmail.com",
    areaServed: { "@type": "Country", "name": "United States" },
    founder: {
      "@type": "Person",
      name: "Kevin Goncalo",
      jobTitle: "Web designer",
      url: `${SITE}/about/`
    },
    sameAs: ["https://www.instagram.com/autodetailingsites"],
    makesOffer: {
      "@type": "Offer",
      name: "Quote-focused detailing website",
      price: "1500",
      priceCurrency: "USD",
      url: `${SITE}/pricing/`,
      description: "Six-page mobile-friendly website with a quote form, basic on-page SEO, one revision round, and a first draft within 7 days after onboarding is complete. Domain, hosting, and the optional care plan are separate until confirmed in writing."
    }
  }
];

const pricingFaqs = [
  {
    q: "What pages are included?",
    a: "Six pages: Home, Services, Gallery, About, Contact with a quote form, and one service-area page."
  },
  {
    q: "How does the 7-day first draft work?",
    a: "After the $750 deposit is paid and you send the materials we ask for, we send a first draft within 7 days. Materials means your services, service area, logo, photos, contact details, and any booking link you already use."
  },
  {
    q: "What is the revision round?",
    a: "You get one organized round of changes to copy, layout, images, and details. Further rounds are quoted before any extra work starts."
  },
  {
    q: "Who owns the finished site?",
    a: "After the $750 balance is paid, you keep the finished website for the business it was built for. Logos, photos, and other materials you provided stay yours. The design and code are not licensed for resale or for a second business unless we agree in writing."
  },
  {
    q: "Are the domain and hosting included?",
    a: "Not unless we agree in writing. The pricing page keeps an open placeholder until the domain and hosting decision is confirmed."
  },
  {
    q: "What does basic SEO include?",
    a: "A unique title and meta description, one clear H1, descriptive headings, alt text, your real service area and contact details in the copy, and pages that can sit on a sitemap. It is not a ranking guarantee, an ads program, or a content retainer."
  },
  {
    q: "What if I only have Facebook or no site at all?",
    a: "You can still ask for a review. The form does not require a website URL. Choose I don't have a site yet, or I only use Facebook or Instagram, and paste a link only if you have one."
  }
];

function faqHtml(items) {
  return `<div class="faq-list">${items
    .map(
      (item, index) => `<details${index === 0 ? " open" : ""}>
              <summary>${item.q}</summary>
              <p>${item.a}</p>
            </details>`
    )
    .join("")}</div>`;
}

function cityCard(href, title, text) {
  return `<article class="city-card">
              <h3><a class="text-link" href="${href}">${title}</a></h3>
              <p>${text}</p>
            </article>`;
}

const seiFigure = `<div class="shot-row">
            <div class="frame">
              <div class="frame-bar" aria-hidden="true"><span></span><span></span><span></span><b>seiautodetailing.com</b></div>
              <picture>
                <source srcset="/assets/sei-og-image-720.webp" type="image/webp">
                <img src="/assets/sei-og-image.jpg" alt="Desktop view of the SEI Auto Detailing homepage." width="720" height="378" decoding="async">
              </picture>
            </div>
            <div class="frame">
              <div class="frame-bar" aria-hidden="true"><span></span><span></span><span></span><b>mobile</b></div>
              <picture>
                <source srcset="/assets/sei-site-mobile-420.webp" type="image/webp">
                <img src="/assets/sei-site-mobile.jpeg" alt="Mobile view of the SEI Auto Detailing site with the headline and quote buttons visible." width="420" height="747" loading="lazy" decoding="async">
              </picture>
            </div>
          </div>`;

const marrowglass = `<figure class="concept concept-marrow">
            <figcaption class="concept-banner">Sample concept · Fictional business · Not a client</figcaption>
            <div class="concept-chrome" aria-hidden="true"><i></i><i></i><i></i><b>sample layout</b></div>
            <div class="concept-canvas">
              <div class="mg-nav">
                <strong>Marrowglass</strong>
                <span>Mobile detailing · by appointment</span>
                <span class="mg-pill">Request a quote</span>
              </div>
              <div class="mg-hero">
                <p class="mg-kicker">Comes to the driveway</p>
                <p class="mg-title">A clean car without giving up the Saturday.</p>
                <p class="mg-sub">Interior reset, exterior wash, and ceramic top-ups. The quote waits until we know the vehicle.</p>
                <div class="mg-actions">
                  <span class="mg-btn">Get a quote</span>
                  <span class="mg-btn ghost">See services</span>
                </div>
              </div>
              <div class="mg-services">
                <article>
                  <h3>Interior reset</h3>
                  <p>Vacuum, surfaces, and the mess a week of commuting leaves behind.</p>
                </article>
                <article>
                  <h3>Exterior wash</h3>
                  <p>Hand wash, wheels, and glass. The page says what is included before anyone asks.</p>
                </article>
                <article>
                  <h3>Ceramic top-up</h3>
                  <p>For cars that already have a coating and need it maintained, not a first-time correction sold as a wash.</p>
                </article>
              </div>
              <p class="mg-note">The review row is empty on purpose. A real detailer would put their own Google reviews here. These are not quotes from anyone.</p>
            </div>
          </figure>`;

const secondlight = `<figure class="concept concept-second">
            <figcaption class="concept-banner">Sample concept · Fictional business · Not a client</figcaption>
            <div class="concept-chrome" aria-hidden="true"><i></i><i></i><i></i><b>sample layout</b></div>
            <div class="concept-canvas">
              <div class="sl-nav">
                <strong>Secondlight Ceramic Studio</strong>
                <span>Shop visits · by appointment</span>
                <span class="sl-pill">Book a look</span>
              </div>
              <div class="sl-hero-wrap">
                <div class="sl-hero">
                  <p class="sl-kicker">Paint correction and ceramic</p>
                  <p class="sl-title">For cars you plan to keep.</p>
                  <p class="sl-sub">A darker, quieter layout for a shop that sells correction and coatings, not a quick wash menu. Prices stay off the page until the paint is seen.</p>
                  <div class="sl-actions">
                    <span class="sl-btn">Request a quote</span>
                    <span class="sl-btn ghost">How a visit works</span>
                  </div>
                </div>
                <div class="sl-menu">
                  <article>
                    <h3>See the paint</h3>
                    <p>Photos of the panels, then a written quote. No package price pretending every car is the same.</p>
                  </article>
                  <article>
                    <h3>Correct, then coat</h3>
                    <p>The menu separates polishing from the coating so those are not sold as one vague "detail."</p>
                  </article>
                  <article>
                    <h3>Your city here</h3>
                    <p>Service area is a blank on this sample. A real shop would name the city and the hours people can drop off.</p>
                  </article>
                </div>
              </div>
              <div class="sl-gallery" aria-hidden="true">
                <div class="sl-swatch">Photo slot</div>
                <div class="sl-swatch">Photo slot</div>
                <div class="sl-swatch">Photo slot</div>
                <div class="sl-swatch">Photo slot</div>
              </div>
              <p class="sl-note">Color blocks stand in for the shop's own before-and-after photos. Nothing here is a real car or a real client.</p>
            </div>
          </figure>`;

const testimonial = `<article class="placeholder-card">
              <strong class="placeholder-label">Placeholder. Not a testimonial.</strong>
              <p>TODO for Kevin: ask SEI Auto Detailing in Warwick, Rhode Island, for a sentence you can publish, and for the name they want credited. Do not write a quote for them. Leave this note in place until their approved words replace it.</p>
            </article>`;

const pages = [];

pages.push({
  file: "index.html",
  url: "/",
  title: "Auto Detailing Websites for $1,500 | AutoDetailingSites",
  description: "Flat-rate $1,500 websites for auto detailers. Mobile quote forms, basic SEO, and a 7-day first draft. See the real SEI Auto Detailing build.",
  active: "",
  extraHead: `<link rel="preload" href="/assets/hero-detailing-wash-960.webp" as="image" type="image/webp" media="(max-width: 959px)" fetchpriority="high">
    <link rel="preload" href="/assets/hero-detailing-wash-1600.webp" as="image" type="image/webp" media="(min-width: 960px)" fetchpriority="high">`,
  schemas: homeSchema,
  body: `<section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">For auto detailers</p>
            <h1>Your detailing work looks premium. <span class="h1-accent">Your website should too.</span></h1>
            <p class="hero-text">People check you on a phone before they call. If the site is confusing, outdated, or missing, they book the shop that was easier to trust.</p>
            <p class="offer-price" id="pricing">
              <span class="offer-amount">$1,500</span>
              <span class="offer-detail">Flat rate. $750 to start, $750 before launch. <a href="/pricing/">See what it includes</a>.</span>
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="#contact">Get a free website review</a>
              <a class="button button-secondary" href="/portfolio/">See the client build</a>
            </div>
          </div>
          <article class="proof-card" id="demo">
            <a class="proof-media" href="https://www.seiautodetailing.com/" target="_blank" rel="noopener noreferrer">
              <picture>
                <source srcset="/assets/sei-og-image-720.webp" type="image/webp">
                <img src="/assets/sei-og-image.jpg" alt="Desktop view of the SEI Auto Detailing homepage." width="720" height="378" fetchpriority="high" decoding="async">
              </picture>
              <span class="sr-only">Open the SEI Auto Detailing site in a new tab</span>
            </a>
            <div>
              <p class="proof-kicker">Real client · Warwick, RI</p>
              <h2>SEI Auto Detailing</h2>
              <p>Live site. The owner wrote his own copy and asked us not to publish package prices.</p>
              <a class="text-link" href="/portfolio/">Read the project notes</a>
            </div>
          </article>
        </div>
        <div class="container">
          <ul class="trust-strip" aria-label="What the build includes">
            <li>7-day first draft</li>
            <li>You own the finished site</li>
            <li>Quote form included</li>
            <li>Basic on-page SEO</li>
          </ul>
          <p class="byline">Built by <a href="/about/">Kevin Goncalo</a>, a US-based web designer. One published client site so far, shown here.</p>
        </div>
      </section>

      <section class="band" id="included">
        <div class="container">
          <div class="section-heading reveal">
            <p class="eyebrow">The $1,500 build</p>
            <h2>A finished detailing site, not a monthly template.</h2>
            <p>Some detailers pay a monthly tool. Others hire a studio for a much larger project. This is one payment for a defined site: clear services, a quote path, and a first draft a week after your materials are in.</p>
          </div>
          <ul class="check-list reveal">
            <li>Six pages: Home, Services, Gallery, About, Contact, and one service-area page</li>
            <li>Mobile layout and a quote form that does not demand a website URL from your customers</li>
            <li>Basic on-page SEO: titles, headings, alt text, and your real service area in the copy</li>
            <li>One revision round, then launch after the balance is paid</li>
            <li>First draft within 7 days once onboarding is complete</li>
            <li>You keep the finished site for your business after the final payment</li>
          </ul>
          <p class="reveal">Domain, hosting, and the optional monthly care plan are <a href="/pricing/">written out on the pricing page</a>, including the decisions that are still open. <a href="/pricing/#process" id="process">See the five-step process</a>.</p>
        </div>
      </section>

      <section class="band band-muted">
        <div class="container">
          <div class="section-heading reveal">
            <p class="eyebrow">What the page is for</p>
            <h2>Three things a detailer's site has to do.</h2>
          </div>
          <div class="card-grid three">
            <article class="card reveal">
              <h3>Name the work</h3>
              <p>Interior, exterior, ceramic, correction, mobile or shop. Visitors should not have to guess which of those you sell.</p>
            </article>
            <article class="card reveal">
              <h3>Make the quote obvious</h3>
              <p>A phone button and a short form, visible on a phone without hunting through the footer.</p>
            </article>
            <article class="card reveal">
              <h3>Show proof you actually have</h3>
              <p>Your photos and your Google reviews. Not stock cars, and not quotes we made up.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="band" id="founder">
        <div class="container founder-layout">
          <div class="reveal">
            <p class="eyebrow">Client words</p>
            <h2>A testimonial goes here when SEI approves one.</h2>
            <p>There are no published testimonials on this site yet. A placeholder is not a review.</p>
            ${testimonial}
          </div>
          <aside class="founder-card reveal">
            <div class="photo-placeholder">Photo placeholder. TODO: add a photo of Kevin Goncalo.</div>
            <h2>Kevin Goncalo</h2>
            <p>US-based web designer. City and a longer bio are still open on the about page.</p>
            <a class="text-link" href="/about/">About Kevin</a>
          </aside>
        </div>
      </section>

      <section class="band band-muted" id="faq">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Before you write</p>
            <h2>Short answers.</h2>
          </div>
          <div class="faq-list">
            <details open>
              <summary>What if I don't have a website yet?</summary>
              <p>Use the form anyway. Pick "I don't have a site yet" or "I only use Facebook or Instagram." The link field is optional.</p>
            </details>
            <details>
              <summary>How fast is the first draft?</summary>
              <p>Within 7 days after the deposit is paid and your onboarding materials are in. Launch timing depends on the revision round and the balance.</p>
            </details>
            <details>
              <summary>Do you guarantee calls or rankings?</summary>
              <p>No. The site is built to remove confusion. It is not a promise of leads, bookings, or Google rankings. The full list of what is included is on the <a href="/pricing/">pricing page</a>.</p>
            </details>
          </div>
        </div>
      </section>

      <section class="band" id="contact">
        <div class="container contact-layout">
          <div>
            <p class="eyebrow">Free website review</p>
            <h2>Send the site you have. Or say you don't have one.</h2>
            <p>We'll reply with what is getting in the way of trust and quote requests: unclear services, a buried next step, a weak phone layout, or no site at all.</p>
            <p>If you only use Facebook or Instagram, that still counts. You do not need a finished website to ask.</p>
          </div>
          <div class="form-card">
            <h2>Request a review</h2>
            ${reviewForm("home", "home")}
          </div>
        </div>
      </section>

      <section class="band band-muted">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Keep reading</p>
            <h2>Notes for three different markets.</h2>
            <p>Written for detailers who work in those places. Not three copies of one page, and not a claim that we have a shop there.</p>
          </div>
          <div class="city-grid">
            ${cityCard("/orlando-detailing-websites/", "Orlando, Florida", "Visitors, vacation rentals, heat, and a map that is too spread out for a vague service area.")}
            ${cityCard("/tampa-detailing-websites/", "Tampa Bay, Florida", "Two sides of the bay, salt air, and afternoon storms. The site should say which trips you actually take.")}
            ${cityCard("/providence-detailing-websites/", "Providence, Rhode Island", "Salt season, a small state with real drive times, and a live client example in nearby Warwick.")}
          </div>
          <p style="margin-top:18px">From the blog: <a href="/blog/quote-requests/">how to get more quote requests</a>, <a href="/blog/what-a-detailing-website-needs/">what a detailing site needs</a>, and <a href="/blog/google-business-profile-for-detailers/">Google Business Profile tips</a>.</p>
        </div>
      </section>`
});

pages.push({
  file: "portfolio/index.html",
  url: "/portfolio/",
  title: "Detailing Website Portfolio | AutoDetailingSites.com",
  description: "One real client site, SEI Auto Detailing in Warwick, RI, plus two labeled sample concepts that are not clients.",
  active: "portfolio",
  crumbLabel: "Portfolio",
  schemas: [{
    "@type": "CollectionPage",
    name: "Detailing website portfolio",
    url: `${SITE}/portfolio/`,
    description: "SEI Auto Detailing, a real client build, and two fictional sample concepts.",
    isPartOf: { "@id": `${SITE}/#website` }
  }],
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Portfolio")}
          <p class="eyebrow">Work</p>
          <h1>One real client. Two sample concepts.</h1>
          <p class="lede">SEI Auto Detailing is a published site for a real business. Marrowglass and Secondlight are layouts designed for this portfolio. Those names are fictional. They are not clients, and they are not live businesses.</p>
        </div>
      </header>
      <section class="band">
        <div class="container case-layout">
          <div>
            <p class="real-tag tag">Real client</p>
            <h2>SEI Auto Detailing</h2>
            <p>Warwick, Rhode Island. The live site is ${ext("https://www.seiautodetailing.com/", "seiautodetailing.com")}.</p>
            <p>The owner wrote his own copy. He asked us not to publish package prices, so the page explains the work and sends people to a quote instead of a rate card. That was his choice. It is a valid way to sell detailing when the quote depends on the vehicle.</p>
            <p>The build gives the business a clear first screen, service packages, a path for mobile or drop-off work, and a quote form. We do not publish a lead count or a ranking claim for this project. We don't have those numbers, and we won't invent them.</p>
            <p>His customers' reviews live on his site. They are reviews of his detailing, not of this web design service. A quote about working with us will be added here only if he approves the words.</p>
            ${testimonial}
            <div class="stack-actions">
              ${ext("https://www.seiautodetailing.com/", `<span class="button button-primary">View the live site</span>`)}
              <a class="button button-secondary" href="/contact/">Ask for a review</a>
            </div>
          </div>
          ${seiFigure}
        </div>
      </section>
      <section class="band band-muted">
        <div class="container">
          <p class="tag">Sample concept</p>
          <h2>Marrowglass Detailing</h2>
          <p>A fictional mobile detailer. Light page, three services, quote before price. Use it as a direction for a driveway-based business. Do not present it as a client.</p>
          ${marrowglass}
        </div>
      </section>
      <section class="band">
        <div class="container">
          <p class="tag">Sample concept</p>
          <h2>Secondlight Ceramic Studio</h2>
          <p>A fictional shop focused on correction and ceramic coating. Darker layout, no wash menu, photo slots left empty so we are not pretending to have the shop's pictures.</p>
          ${secondlight}
          <p>Want the real scope and price? <a href="/pricing/">The $1,500 build is listed here</a>.</p>
        </div>
      </section>`
});

pages.push({
  file: "pricing/index.html",
  url: "/pricing/",
  title: "Detailing Website Cost: $1,500 Flat | AutoDetailingSites",
  description: "What the $1,500 detailing website includes: six pages, mobile quote form, basic SEO, one revision, and a 7-day first draft. Domain and hosting are still to confirm.",
  active: "pricing",
  crumbLabel: "Pricing",
  schemas: [
    {
      "@type": "WebPage",
      name: "Detailing website pricing",
      url: `${SITE}/pricing/`,
      description: "Flat-rate $1,500 website build for auto detailers.",
      isPartOf: { "@id": `${SITE}/#website` }
    },
    {
      "@type": "Offer",
      name: "Quote-focused detailing website",
      price: "1500",
      priceCurrency: "USD",
      url: `${SITE}/pricing/`,
      description: "Six-page website for an auto detailer. Domain, hosting, and the optional care plan are not included unless agreed in writing."
    },
    {
      "@type": "FAQPage",
      mainEntity: pricingFaqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    }
  ],
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Pricing")}
          <p class="eyebrow">Pricing</p>
          <h1>A $1,500 detailing website, with the work written down.</h1>
          <p class="lede">One flat rate for a site that explains the services and makes a quote request easy. It is not a monthly website subscription, and it is not an open-ended studio project.</p>
        </div>
      </header>
      <section class="band">
        <div class="container pricing-top">
          <div class="price-card">
            <p class="eyebrow">Quote-focused website</p>
            <p class="price-amount">$1,500</p>
            <p class="price-note">Paid in two parts.</p>
            <div class="pay-row"><span>Deposit to start</span><strong>$750</strong></div>
            <div class="pay-row"><span>Balance before launch</span><strong>$750</strong></div>
            <ul class="check-list" aria-label="Included">
              <li>Six pages, listed below</li>
              <li>Mobile-first layout</li>
              <li>Quote form</li>
              <li>Basic on-page SEO</li>
              <li>One revision round</li>
              <li>First draft within 7 days of completed onboarding</li>
            </ul>
            <a class="button button-primary full-width" href="/contact/">Request a free review</a>
            <p class="form-note">The review is free. The build starts when the deposit is paid.</p>
          </div>
          <div class="prose">
            <h2>The six pages</h2>
            <ol>
              <li>Home, with what you do, where you work, and a way to ask for a quote.</li>
              <li>Services, named the way customers say them.</li>
              <li>Gallery, using photos you provide.</li>
              <li>About, with claims you can stand behind.</li>
              <li>Contact, with a quote form and your phone number if you want calls.</li>
              <li>One service-area page for the place you actually cover.</li>
            </ol>
            <h2>Also included</h2>
            <ul>
              <li>A layout that works on a phone, including tap-to-call if you give us a number.</li>
              <li>A quote form that asks for a name, a way to reply, the vehicle, and the service. Your customers are not asked for a website URL.</li>
              <li>Basic on-page SEO: a unique title and meta description, one H1, descriptive headings, image alt text, and your real service area and contact details in the copy.</li>
              <li>Light editing so the copy you send is organized. We are not inventing a brand story from nothing.</li>
              <li>One revision round after the first draft.</li>
              <li>Launch checks for the pages, form, buttons, and links after the balance is paid.</li>
            </ul>
            <h2>Who owns the site</h2>
            <p>After the balance is paid, you keep the finished website for the business it was built for. Your logos, photos, reviews, and other materials stay yours. The design and code are for that business. Reselling them, or reusing them for a different business, needs written permission. That matches the <a href="/terms/">terms</a>.</p>
            <div class="placeholder-card">
              <strong class="placeholder-label">Confirm before you rely on it</strong>
              <p>TODO for Kevin: confirm this ownership split matches the agreement you send to clients, including design files and any third-party fonts or icons.</p>
            </div>
            <h2 id="domain">Domain and hosting</h2>
            <div class="placeholder-card">
              <strong class="placeholder-label">Placeholder. Not decided.</strong>
              <p>TODO for Kevin: write the real policy here. Cover who registers the domain, whose account it lives in, where the site is hosted, what it costs, and who pays the renewal. Until that is written, domain and hosting are not part of the $1,500.</p>
            </div>
            <h2 id="care">Optional monthly care</h2>
            <div class="placeholder-card">
              <strong class="placeholder-label">Placeholder price</strong>
              <p>TODO for Kevin: the optional care plan is $TODO per month. Replace $TODO with the real price and say what the month includes, such as small text and photo updates, a check that the quote form still delivers, and help with hosting questions. New pages and redesigns are separate unless you decide otherwise. Do not leave $TODO on the live offer.</p>
            </div>
            <h2>Guarantee</h2>
            <p>There is no promise of rankings, leads, bookings, or revenue. A clearer site removes reasons to hesitate. It does not control who searches that week.</p>
            <div class="placeholder-card">
              <strong class="placeholder-label">Open decision</strong>
              <p>TODO for Kevin: if you offer a workmanship guarantee, such as a fix period after launch, write it here. If you do not, delete this note and leave the sentence above.</p>
            </div>
            <h2>Not included</h2>
            <ul>
              <li>A new logo, or a photo shoot.</li>
              <li>A full copywriting project beyond organizing what you send.</li>
              <li>Booking-software fees, ads, or review buying.</li>
              <li>Extra pages beyond the six, or a second revision round, unless quoted first.</li>
              <li>Domain registration and hosting, unless the placeholder above has been replaced with a written policy.</li>
            </ul>
          </div>
        </div>
      </section>
      <section class="band band-muted" id="process">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Process</p>
            <h2>Five steps. The clock starts when onboarding is complete.</h2>
          </div>
          <ol class="steps">
            <li>
              <h3>Free website review</h3>
              <p>Send a site, a Facebook page, or neither. We point out what is getting in the way of a quote.</p>
            </li>
            <li>
              <h3>Deposit and onboarding</h3>
              <p>The $750 deposit reserves the build. You send services, service area, logo, photos, contact info, and booking links.</p>
            </li>
            <li>
              <h3>First draft within 7 days</h3>
              <p>Once those materials are in, we send a first draft within 7 days.</p>
            </li>
            <li>
              <h3>One revision round</h3>
              <p>You send one organized set of changes. We tighten the copy, layout, images, and details.</p>
            </li>
            <li>
              <h3>Balance and launch</h3>
              <p>After the remaining $750 is paid, we connect the domain you are using, publish the site, and test the form and buttons. Domain and hosting details wait on the decision above.</p>
            </li>
          </ol>
        </div>
      </section>
      <section class="band">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Questions</p>
            <h2>What detailers ask before they pay the deposit.</h2>
          </div>
          ${faqHtml(pricingFaqs)}
          <p>See the <a href="/portfolio/">SEI build</a> or <a href="/contact/">ask for a review</a>.</p>
        </div>
      </section>`
});

pages.push({
  file: "about/index.html",
  url: "/about/",
  title: "About Kevin Goncalo | AutoDetailingSites.com",
  description: "Kevin Goncalo is the US-based web designer behind AutoDetailingSites.com. He builds flat-rate websites for auto detailers.",
  active: "about",
  crumbLabel: "About",
  schemas: [{
    "@type": "Person",
    name: "Kevin Goncalo",
    jobTitle: "Web designer",
    url: `${SITE}/about/`,
    email: "kevingoncalo@gmail.com",
    workLocation: { "@type": "Country", name: "United States" },
    sameAs: ["https://www.instagram.com/autodetailingsites"],
    worksFor: { "@type": "Organization", name: "AutoDetailingSites.com", url: `${SITE}/` }
  }],
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "About")}
          <p class="eyebrow">The person who builds the site</p>
          <h1>Kevin Goncalo</h1>
          <p class="lede">US-based web designer. AutoDetailingSites.com is his practice for auto detailers who need a clear site, not a faceless agency project.</p>
        </div>
      </header>
      <section class="band">
        <div class="container founder-layout">
          <div class="photo-placeholder">Photo placeholder.<br>TODO: add a real photo of Kevin Goncalo. Do not use a stock portrait.</div>
          <div class="prose">
            <p class="placeholder-card"><strong class="placeholder-label">City</strong> TODO: add the city you want listed. The public fact today is only this: based in the United States.</p>
            <h2>What is already true</h2>
            <p>Kevin designs and builds the sites. There is no separate account team. The published client build so far is <a href="/portfolio/">SEI Auto Detailing in Warwick, Rhode Island</a>. The owner of that business wrote his own copy and asked to keep package prices off the site.</p>
            <p>Most detailers do not need a months-long branding program. They need a professional site that says what they do, shows the work they actually have, and gives a customer an obvious way to ask for a quote. That is the $1,500 offer on the <a href="/pricing/">pricing page</a>.</p>
            <h2>Bio details still to add</h2>
            <div class="placeholder-card">
              <strong class="placeholder-label">Do not invent this</strong>
              <p>TODO for Kevin: add a short bio using only facts you want public. Years designing, other kinds of work, and anything a detailer should know all belong here if they are true. Nothing biographical has been filled in beyond the job and the client project above.</p>
            </div>
            <p>Instagram: ${ext("https://www.instagram.com/autodetailingsites", "@autodetailingsites")}. For a project, use the <a href="/contact/">contact form</a>. Phone, calendar, and a domain email are listed there as open items, not as made-up contacts.</p>
          </div>
        </div>
      </section>`
});

pages.push({
  file: "contact/index.html",
  url: "/contact/",
  title: "Free Detailing Website Review | AutoDetailingSites",
  description: "Request a free review of your detailing website, Facebook page, or the fact that you don't have a site yet. The website URL is optional.",
  active: "contact",
  crumbLabel: "Contact",
  schemas: [{
    "@type": "ContactPage",
    name: "Contact AutoDetailingSites.com",
    url: `${SITE}/contact/`,
    description: "Free website review form for auto detailers.",
    isPartOf: { "@id": `${SITE}/#website` }
  }],
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Contact")}
          <p class="eyebrow">Contact</p>
          <h1>Tell us what you have. A website is optional.</h1>
          <p class="lede">Detailers with no site, or with only a Facebook or Instagram page, can use this form. If you have a site, send it. If you don't, say so. We will reply by email.</p>
        </div>
      </header>
      <section class="band">
        <div class="container contact-layout">
          <div class="prose">
            <h2>Other ways to reach Kevin</h2>
            <p>Email today: <a href="mailto:kevingoncalo@gmail.com">kevingoncalo@gmail.com</a></p>
            <div class="placeholder-card">
              <strong class="placeholder-label">Domain email</strong>
              <p>TODO for Kevin: when a domain email is ready, replace the Gmail address here, on the privacy policy, on the terms, and in the structured data. Until then, the Gmail address is the real inbox.</p>
            </div>
            <div class="placeholder-card">
              <strong class="placeholder-label">Phone</strong>
              <p>TODO for Kevin: add a phone number you actually answer, or delete this note. No number is published because none has been confirmed.</p>
            </div>
            <div class="placeholder-card">
              <strong class="placeholder-label">Calendar</strong>
              <p>TODO for Kevin: add a scheduling link you use, such as a calendar page you control. Do not publish a placeholder booking link.</p>
            </div>
            <p>Instagram: ${ext("https://www.instagram.com/autodetailingsites", "@autodetailingsites")}.</p>
            <h2>What happens next</h2>
            <p>You get a human reply about the site or the page you sent, or about starting from nothing. The form does not book a build by itself. If you want to move ahead, the <a href="/pricing/">$1,500 scope</a> is the offer we would be talking about.</p>
          </div>
          <div class="form-card" id="review">
            <h2>Request a free review</h2>
            ${reviewForm("contact", "contact")}
          </div>
        </div>
      </section>`
});

function localPage({ file, url, title, description, crumb, areaName, areaSchema, body }) {
  pages.push({
    file,
    url,
    title,
    description,
    active: "",
    crumbLabel: crumb,
    schemas: [
      {
        "@type": "WebPage",
        name: title,
        url: SITE + url,
        description,
        isPartOf: { "@id": `${SITE}/#website` }
      },
      {
        "@type": "Service",
        name: `Website design for auto detailers in ${areaName}`,
        serviceType: "Auto detailing website design",
        url: SITE + url,
        provider: {
          "@type": "ProfessionalService",
          name: "AutoDetailingSites.com",
          url: `${SITE}/`,
          areaServed: { "@type": "Country", name: "United States" }
        },
        areaServed: areaSchema
      }
    ],
    body
  });
}

localPage({
  file: "orlando-detailing-websites/index.html",
  url: "/orlando-detailing-websites/",
  title: "Websites for Orlando Auto Detailers | AutoDetailingSites",
  description: "What an Orlando detailer's website should answer: mobile range, vacation-rental jobs, heat, and a clear quote path. Flat-rate builds are $1,500.",
  crumb: "Orlando",
  areaName: "Orlando",
  areaSchema: { "@type": "City", name: "Orlando", containedInPlace: { "@type": "State", name: "Florida" } },
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Orlando")}
          <p class="eyebrow">Orlando, Florida</p>
          <h1>Websites for auto detailers in Orlando</h1>
          <p class="lede">This page is for detailers who serve Orlando. It is not a directory of shops, and AutoDetailingSites.com does not have an Orlando office. Kevin Goncalo designs the sites from elsewhere in the United States.</p>
        </div>
      </header>
      <section class="band">
        <div class="container prose">
          <p>Orlando customers are a mix of people who live there and people who are in town for a short stay. A homepage written for "any city" does not answer the questions you already handle by text. The notes below are the ones worth putting on the site in your own words.</p>
          <h2>Say who you will actually drive to</h2>
          <p>Winter Park, Lake Nona, Dr. Phillips, Conway, and the vacation-rental pockets near the parks are different appointments. Write the areas you cover. Say whether a gated community, an apartment garage, or a rental driveway is something you accept. If you do not go to Kissimmee, say that boundary. You will turn away a few mismatched requests and keep the ones you can serve.</p>
          <h2>Visitors book differently than neighbors</h2>
          <p>A resident may want a maintenance wash on a normal week. A visitor may need the car cleaned before a return deadline, and they may not know your neighborhoods. If you take that work, publish how much notice you need. If you do not take hotel or rental turns, say so on the page. A holiday week is a bad time to explain your lead time for the first time.</p>
          <h2>Heat, sun, and pollen belong in the service copy</h2>
          <p>Coatings and corrections in Central Florida need a plan for sun and for pollen season. You do not need a chemistry essay. Say what you need on site: shade or a garage, whether the car can stay put, and how long it has to sit. Describe the steps you control. Leave results that depend on the weather out of the promise.</p>
          <h2>Mobile is the default for a lot of these businesses</h2>
          <p>Many Orlando detailers never ask the customer to cross town. The site should show a tap-to-call number, a short quote form, and photos from the kinds of driveways and garages you work in. If you have a bay people can visit, publish that address and the hours you are actually there. If you do not, do not invent a storefront.</p>
          <h2>What we would build</h2>
          <p>The offer is the same <a href="/pricing/">$1,500 site</a>: six pages, a mobile quote form, basic on-page SEO, one revision round, and a first draft within 7 days after your materials are in. The published client example is <a href="/portfolio/">SEI Auto Detailing in Warwick, Rhode Island</a>, not an Orlando shop. An Orlando project would be a new build with your photos, your service area, and your prices or your quote process.</p>
          <p>Related reading: <a href="/blog/what-a-detailing-website-needs/">what a detailing website needs</a> and <a href="/tampa-detailing-websites/">the Tampa Bay notes</a>, which deal with bridges and salt air instead of theme-park weeks.</p>
          <p><a class="button button-primary" href="/contact/">Request a free review</a></p>
        </div>
      </section>`
});

localPage({
  file: "tampa-detailing-websites/index.html",
  url: "/tampa-detailing-websites/",
  title: "Websites for Tampa Bay Auto Detailers | AutoDetailingSites",
  description: "Notes for Tampa Bay detailers: which side of the bay you serve, salt and storms, and a quote path that does not hide the service area. Sites are $1,500.",
  crumb: "Tampa Bay",
  areaName: "Tampa Bay",
  areaSchema: { "@type": "AdministrativeArea", name: "Tampa Bay, Florida" },
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Tampa Bay")}
          <p class="eyebrow">Tampa Bay, Florida</p>
          <h1>Websites for auto detailers in Tampa Bay</h1>
          <p class="lede">This is for detailers who work around Tampa, St. Petersburg, or Clearwater. AutoDetailingSites.com is not a local shop and does not have a bay-area office. The page is about what your website should make obvious.</p>
        </div>
      </header>
      <section class="band">
        <div class="container prose">
          <p>Tampa Bay looks like one metro on a map and like several drives once a bridge is involved. A site that only says "Tampa Bay" creates appointments you cannot keep. The useful homepage is specific about the trips you take and the work the climate creates.</p>
          <h2>Name the side of the bay</h2>
          <p>Tampa, South Tampa, Brandon, and Wesley Chapel are not the same route as St. Petersburg or Clearwater. List the cities you serve and the ones you decline. If a cross-bay job needs a higher minimum or a different day, write that policy. Customers would rather see it than discover it after they have requested a quote.</p>
          <h2>Salt, humidity, and storm afternoons</h2>
          <p>Cars here sit in salt air, and summer afternoons often bring rain. Exterior work needs a weather plan. Say whether rain reschedules a coating or a wash, and how you tell the customer. Interior work can be a different answer than paint work. Put your real rule on the page. Also say whether you detail boats. If you only do cars, say that in the first screen so a boater does not book the wrong person.</p>
          <h2>Most of these cars live outside</h2>
          <p>Service copy can talk about salt film, a damp cabin, and paint that never sees a garage, because that is ordinary here. It should still be your description of your services, not a borrowed paragraph from an inland city. Photos should be your jobs, including the ordinary daily drivers, not only a show car.</p>
          <h2>Publish the hours you can actually offer</h2>
          <p>Some detailers run early mobile routes for people who commute, including folks near MacDill who need the car back before a shift. If you offer a before-work or Saturday window, publish it. If every job needs two days' notice, publish that instead. A blank "call for hours" line just moves the question back to your phone.</p>
          <h2>The build, without a local storefront claim</h2>
          <p>We build the <a href="/pricing/">$1,500 website</a> for the detailer. We do not detail cars in Tampa. The live client example is <a href="/portfolio/">SEI Auto Detailing in Warwick, Rhode Island</a>. Use it to see a real quote-focused page, then judge the Orlando notes separately if you also want a comparison: <a href="/orlando-detailing-websites/">Orlando is a visitor-and-sprawl problem</a>, not a bridge problem.</p>
          <p>If your Google profile and your site disagree about mobile versus shop, fix that before you worry about a new slogan. The <a href="/blog/google-business-profile-for-detailers/">Business Profile notes</a> cover the setup without a ranking promise.</p>
          <p><a class="button button-primary" href="/contact/">Request a free review</a></p>
        </div>
      </section>`
});

localPage({
  file: "providence-detailing-websites/index.html",
  url: "/providence-detailing-websites/",
  title: "Websites for Providence Auto Detailers | AutoDetailingSites",
  description: "What a Providence detailer's site should spell out: salt season, a real service radius, and a quote path. Includes the Warwick client build, SEI Auto Detailing.",
  crumb: "Providence",
  areaName: "Providence",
  areaSchema: { "@type": "City", name: "Providence", containedInPlace: { "@type": "State", name: "Rhode Island" } },
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Providence")}
          <p class="eyebrow">Providence, Rhode Island</p>
          <h1>Websites for auto detailers in Providence</h1>
          <p class="lede">Written for detailers who work in Providence and the nearby cities they actually drive to. We do not have a Providence shop. The closest published client build is in Warwick.</p>
        </div>
      </header>
      <section class="band">
        <div class="container prose">
          <p>Rhode Island is small, and the drives are still real. A site that says "serving all of Rhode Island" without a boundary creates Saturday routes that do not fit. Seasonal work matters here in a way it does not in central Florida. The page should change its emphasis through the year, even if the design stays put.</p>
          <h2>Salt season and the spring rush</h2>
          <p>Winter road salt and the first warm weekends are when people compare a few detailers at once. If you offer an undercarriage rinse or a salt cleanup, give it a plain name on the services page before spring. If you do not offer it, do not let a template imply that you do. Say what "spring detail" includes: interior, wash, or paint work. Those are different jobs and different amounts of time.</p>
          <h2>Write the radius you will drive</h2>
          <p>Providence, Cranston, Pawtucket, East Providence, Warwick, and a Newport run are not interchangeable. List the cities you want. A Warwick detailer and a Federal Hill mobile route are different businesses even though both sit in the Providence metro. Customers booking from a phone need the list more than a paragraph about passion for cars.</p>
          <h2>A real site from Warwick, with the owner's choices intact</h2>
          <p><a href="https://www.seiautodetailing.com/" target="_blank" rel="noopener noreferrer">SEI Auto Detailing<span class="sr-only"> (opens in a new tab)</span></a> is a live client site in Warwick. The owner wrote his own copy and asked us not to publish package prices. The page explains the work and asks for a quote. That is a useful local reference if you are deciding whether to show prices. It is not proof that we detail cars, and it is not a Providence storefront. Notes and screenshots are on the <a href="/portfolio/">portfolio page</a>.</p>
          <h2>Tight streets, if you are mobile</h2>
          <p>A lot of Providence housing does not have a wide driveway. If you come to the customer, say what you need: a legal place to park, water, and power if you use it. That one paragraph prevents a wasted trip to a triple-decker street where the only spot is a tow zone. If customers come to you instead, publish the real address and the hours you are open. Do not list a service area you never drive and also hide the shop address.</p>
          <h2>Same offer, local copy</h2>
          <p>The website build is <a href="/pricing/">$1,500</a>, with the page list, the revision round, and the 7-day first draft spelled out there. Domain and hosting are still an open decision on that page. For a broader checklist that is not Rhode Island specific, read <a href="/blog/what-a-detailing-website-needs/">what a detailing website needs</a>. The Florida notes are different problems: <a href="/orlando-detailing-websites/">Orlando visitors and sprawl</a>, and <a href="/tampa-detailing-websites/">Tampa Bay bridges and salt air</a>.</p>
          <p><a class="button button-primary" href="/contact/">Request a free review</a></p>
        </div>
      </section>`
});

const posts = [
  {
    slug: "quote-requests",
    title: "How to Get More Quote Requests From a Detailing Site",
    description: "Practical ways a detailing website can earn more quote requests: a clear next step, plain service names, a short form, and real photos. No invented conversion rates.",
    h1: "How to get more quote requests from your detailing website",
    body: `<p>A detailing site usually loses the job before anyone argues about price. The person on a phone cannot tell what you do, where you work, or how to ask. The fixes below are things you can check on the site you already have. None of them depend on a conversion percentage, because those numbers vary and this page is not going to invent one.</p>
          <h2>Put one next step where a thumb can reach it</h2>
          <p>Pick the action you actually answer. That might be a short form, a tap-to-call button, or a booking link you already use. Put it in the header and again after the services. If a form, a phone number, an Instagram DM, a PDF price list, and a booking app all compete, people stall. One obvious path is enough.</p>
          <h2>Name the services the way customers say them</h2>
          <p>Interior detail, exterior detail, ceramic coating, paint correction, mobile detailing. If the page only says "packages," people cannot tell whether you wash cars or correct paint. Use the words you want more of. A package name can stay, as long as the line under it says what the work is.</p>
          <h2>State the service area in plain language</h2>
          <p>Write the cities you serve, or the rule for how far you drive. "Greater metro" is not a plan. A detailer who declines jobs across a bridge, or who will not enter a gated community, should say so. You can see how that differs by market in the notes for <a href="/orlando-detailing-websites/">Orlando</a>, <a href="/tampa-detailing-websites/">Tampa Bay</a>, and <a href="/providence-detailing-websites/">Providence</a>.</p>
          <h2>Show your work</h2>
          <p>Use before-and-after photos of your jobs, with enough light to see the paint. A stock photo of a random car makes the business look rented. If you are early and the gallery is thin, use fewer real photos rather than filler. Label the work honestly. A maintenance wash is not a correction.</p>
          <h2>Shorten the form</h2>
          <p>Ask for a name, a phone number or email, the vehicle, the service, and a note. That is enough to quote or to schedule a look. Do not require a website URL. Your customer is trying to get a car cleaned, not to hire a web designer. Tell them what happens next, and only promise a same-day reply if you actually send one.</p>
          <h2>Offer a phone path</h2>
          <p>Some people will not fill out a form in a driveway. Put the number you answer in the header on mobile, as a link that starts a call. If you would rather text, say "text is fine" next to the number. If you do not want calls, do not print a number you will ignore.</p>
          <h2>Use reviews you actually have</h2>
          <p>Link to your Google reviews. Quote a customer only with permission, and only with their real words. Do not buy reviews and do not write them yourself from another account. If you have no reviews yet, skip the testimonial row. An empty honest page is better than a fake one. That is also why this site does not show a client quote until SEI Auto Detailing approves one.</p>
          <h2>Keep the page readable on a phone</h2>
          <p>Tiny gray text, a hero video that never finishes, and a menu that covers the quote button all create the same result. People leave. You do not need a statistic about mobile traffic to justify a layout that can be used with one thumb. Read your own homepage on your phone with the brightness down. If you cannot find the quote button, neither can they.</p>
          <h2>When a new site is the cleaner fix</h2>
          <p>If the current site cannot be edited, the only presence is a Facebook page, or the layout fights every change, rebuilding is simpler than another plugin. The scope we use is on the <a href="/pricing/">pricing page</a>: six pages, a quote form, basic on-page SEO, one revision, and a first draft within 7 days after onboarding. It is $1,500. It is not a guarantee of more jobs. It removes the confusion that keeps people from asking.</p>`
  },
  {
    slug: "what-a-detailing-website-needs",
    title: "What a Detailing Website Needs | AutoDetailingSites",
    description: "The pages and answers a detailing website needs: services, proof, service area, a quote path, and basic search setup. What can wait until later.",
    h1: "What a detailing website needs",
    body: `<p>A detailing website has one job before it has a style: answer what you do, where, and how to ask for a price. The list below is the set that does that. You can launch without a blog, without a booking app for every niche, and without a 40-page sitemap.</p>
          <h2>A first screen with three answers</h2>
          <p>The top of the homepage should say the service, the area, and the next step. "Premium auto care" is not a service. "Mobile interior and exterior detailing in Warwick and nearby Rhode Island" is. Pair it with a quote or call button that is visible without scrolling past a gallery.</p>
          <h2>A services page for the jobs you want</h2>
          <p>List the work you want more of. Give each one a plain description: what is included, what is not, and whether you need to see the car before you name a price. Add-ons can be a short list. They should not bury the main offers. If you do not coat cars, do not leave a ceramic block on the page because a template had one.</p>
          <h2>A gallery of your vehicles</h2>
          <p>Eight clear photos of your work will do more than a slideshow of stock images. Show the before state when you have it. Ordinary daily drivers belong in the gallery. If a photo is dark or blurry, leave it out.</p>
          <h2>An about page with true claims</h2>
          <p>Say who shows up, whether you are mobile, shop-based, or both, and how the business started if you want to. Skip awards, years, and insurance claims you cannot stand behind. A short true paragraph is enough. Customers are checking whether a real person is behind the form.</p>
          <h2>A contact page a tired person can finish</h2>
          <p>Name, a way to reply, vehicle, service, and a note. Phone number if you want calls. Service area repeated here so nobody has to go back. If you use a booking link, put it beside the form and say which one you prefer. Do not make the form ask for a company website. That field is for selling websites, not for booking a detail.</p>
          <h2>Prices, or an honest quote process</h2>
          <p>Either show prices or explain how quotes work. Both can be right. Hiding prices is a real choice when the number depends on size and condition. <a href="/portfolio/">SEI Auto Detailing</a> is a live example: the owner wrote his own copy and asked to keep package prices off the site. The page still says what the work includes and how to request a quote. If you hide prices, say that the quote comes after you see the vehicle. Do not leave a blank where a decision should be.</p>
          <h2>One solid service-area page</h2>
          <p>If you cover a messy map, one honest page beats ten copied city pages. Name the places you serve and the places you do not. Mention the local constraints that change the job, in your own words. A page that only swaps the city name is not a service area. It is a duplicate.</p>
          <h2>Basic search setup</h2>
          <p>Each page needs its own title and meta description, one H1, and copy that includes the services and the area in normal sentences. Image alt text should describe the photo. Link your Google Business Profile to the site, and make sure the name, service area, and phone number match. That is basic on-page work. It is not a promise that you will rank first.</p>
          <h2>What can wait</h2>
          <p>A blog, a loyalty program, animation, and a second location page can wait until the core site is easy to use. If you want the set above built as a fixed project, the <a href="/pricing/">$1,500 offer</a> is six pages, a quote form, that basic SEO, one revision round, and a first draft within 7 days after you send your materials.</p>`
  },
  {
    slug: "google-business-profile-for-detailers",
    title: "Google Business Profile Tips for Detailers | AutoDetailingSites",
    description: "How auto detailers should set up a Google Business Profile: real name, service area, photos, and reviews. Practical setup, not a ranking guarantee.",
    h1: "Google Business Profile tips for auto detailers",
    body: `<p>Your Google Business Profile is often the first thing people see, before they reach your website. The notes below follow Google's own rules for how a business should represent itself, plus the practical parts a customer needs. Nothing here promises a ranking, a number of calls, or a map-pack position. Those move, and they are not something a checklist can honestly guarantee.</p>
          <p>Google publishes the rules here: <a href="https://support.google.com/business/answer/3038177" target="_blank" rel="noopener noreferrer">Guidelines for representing your business on Google<span class="sr-only"> (opens in a new tab)</span></a>. If a tip on this page and that document ever disagree, follow Google.</p>
          <h2>Use the real business name</h2>
          <p>The name on the profile should be the name you use in the real world. Do not add cities or services to it. "SEI Auto Detailing" is a name. "SEI Auto Detailing Best Ceramic Warwick Cheap" is a keyword string, and Google's guidelines tell businesses not to do that. The same name should appear on your website, your invoices, and the profile.</p>
          <h2>Match the profile to how customers reach you</h2>
          <p>If customers come to a shop, use that address and the hours you keep. If you go to them and you do not have a storefront, set the profile up as a service-area business and list the areas you serve. Do not use a virtual office, a post office box, or a borrowed address as if people can visit you there. Google's guidelines are clear on that, and a customer who drives to an address that is not a shop will not book you twice.</p>
          <p>The areas on the profile and the areas on your website should be the same list. If the site says mobile-only and the profile shows a shop, fix one of them.</p>
          <h2>Categories and services</h2>
          <p>Choose the most specific primary category that fits. Auto detailing is a real category. Add a secondary category only if you truly offer that work. Then add your services with short descriptions in normal language. A coating and a maintenance wash should not share one vague line.</p>
          <h2>Photos of your work</h2>
          <p>Upload photos you took: finished cars, the shop or the van if you have one, and you or your team if you are willing to be in the photo. Skip stock images. Skip a logo stretched into a cover photo if you have real work to show. Update the set when you have new jobs. You do not need a daily upload.</p>
          <h2>Reviews, without games</h2>
          <p>Ask recent customers to leave a review on Google. Do not offer incentives that violate Google's review policies, and do not post reviews yourself from other accounts. Reply to the reviews you get, including the critical ones, without arguing out a private complaint in public. If you have no reviews yet, the right move is to do good work and ask. It is not to write them.</p>
          <h2>Posts only when something is true</h2>
          <p>Use posts for a real update: a schedule change around a storm, a coating option you actually offer this month, a week you are booked. Do not post the same sentence every day. An empty post feed is fine. A misleading one is not.</p>
          <h2>Point the profile at a website that agrees with it</h2>
          <p>Add your website URL. The site should repeat the same services, the same area, and the same phone number. A profile that promises same-day mobile work and a site that never mentions mobile will lose people in the gap. If you do not have a site yet, you can still keep the profile accurate, and you can <a href="/contact/">ask for a site</a> without pretending the Facebook page is a finished website.</p>
          <p>For what to put on that site once you have one, read <a href="/blog/what-a-detailing-website-needs/">what a detailing website needs</a> and <a href="/blog/quote-requests/">how quote requests get lost</a>. The build we sell is described on the <a href="/pricing/">pricing page</a>.</p>`
  }
];

pages.push({
  file: "blog/index.html",
  url: "/blog/",
  title: "Notes for Auto Detailers | AutoDetailingSites.com",
  description: "Practical notes for auto detailers: quote requests, what a website needs, and Google Business Profile setup. No invented statistics.",
  active: "blog",
  crumbLabel: "Blog",
  schemas: [{
    "@type": "Blog",
    name: "AutoDetailingSites.com notes",
    url: `${SITE}/blog/`,
    description: "Articles for auto detailers about websites and Google Business Profile.",
    publisher: { "@id": `${SITE}/#business` }
  }],
  body: `<header class="page-hero">
        <div class="container">
          ${crumbsHtml([], "Blog")}
          <p class="eyebrow">Blog</p>
          <h1>Notes for detailers who want a clearer website.</h1>
          <p class="lede">Three starting articles. They are practical, and they do not use made-up statistics. Written by <a href="/about/">Kevin Goncalo</a>.</p>
        </div>
      </header>
      <section class="band">
        <div class="container post-list">
          ${posts
            .map(
              (post) => `<article class="post-card">
              <p class="post-meta">November 11, 2026 · Kevin Goncalo</p>
              <h2><a href="/blog/${post.slug}/">${post.h1}</a></h2>
              <p>${post.description}</p>
              <a class="text-link" href="/blog/${post.slug}/">Read the article</a>
            </article>`
            )
            .join("")}
        </div>
      </section>`
});

for (const post of posts) {
  const url = `/blog/${post.slug}/`;
  pages.push({
    file: `blog/${post.slug}/index.html`,
    url,
    title: post.title,
    description: post.description,
    active: "blog",
    ogType: "article",
    crumbLabel: post.h1,
    crumbs: [{ href: "/blog/", label: "Blog" }],
    schemas: [{
      "@type": "BlogPosting",
      headline: post.h1,
      description: post.description,
      datePublished: DATE,
      dateModified: DATE,
      author: { "@type": "Person", name: "Kevin Goncalo", url: `${SITE}/about/` },
      publisher: {
        "@type": "Organization",
        name: "AutoDetailingSites.com",
        url: `${SITE}/`,
        logo: { "@type": "ImageObject", url: `${SITE}/assets/autodetailingsites-logo-640.png` }
      },
      image: `${SITE}/og-image.jpg`,
      mainEntityOfPage: SITE + url
    }],
    body: `<header class="page-hero">
        <div class="container narrow">
          ${crumbsHtml([{ href: "/blog/", label: "Blog" }], post.h1)}
          <p class="post-meta">November 11, 2026 · <a href="/about/">Kevin Goncalo</a></p>
          <h1>${post.h1}</h1>
        </div>
      </header>
      <article class="band">
        <div class="container narrow prose">
          ${post.body}
          <h2>If you want the site built</h2>
          <p>The flat-rate offer is <a href="/pricing/">$1,500</a>. If you want a second set of eyes first, the <a href="/contact/">review form</a> does not require a website URL.</p>
        </div>
      </article>`
  });
}

pages.push({
  file: "privacy/index.html",
  url: "/privacy/",
  title: "Privacy Policy | AutoDetailingSites.com",
  description: "Privacy Policy for AutoDetailingSites.com. What the review form collects, how Google Analytics and the Meta pixel are used, and how to contact us.",
  active: "",
  crumbLabel: "Privacy Policy",
  robots: "index, follow",
  schemas: [{
    "@type": "WebPage",
    name: "Privacy Policy",
    url: `${SITE}/privacy/`,
    description: "Privacy Policy for AutoDetailingSites.com.",
    isPartOf: { "@id": `${SITE}/#website` }
  }],
  body: `<header class="page-hero">
        <div class="container narrow">
          ${crumbsHtml([], "Privacy Policy")}
          <!-- TODO: Review with an attorney before relying on this as final legal language. TODO: Kevin, replace kevingoncalo@gmail.com if you switch to a domain email. -->
          <p class="eyebrow">Privacy Policy</p>
          <h1>Privacy Policy</h1>
          <p class="lede">Last updated: November 11, 2026</p>
        </div>
      </header>
      <section class="band">
        <div class="container narrow legal-card prose">
          <p>AutoDetailingSites.com respects your privacy. This policy explains what information we collect, how we use it, and how you can contact us with questions.</p>
          <h2>1. Information we collect</h2>
          <p>We may collect information you submit through our website forms, including:</p>
          <ul>
            <li>Name</li>
            <li>Business name</li>
            <li>Email address</li>
            <li>Phone number, if you provide one</li>
            <li>Whether you have a website, do not have one yet, or only use Facebook or Instagram</li>
            <li>A website, Facebook, or Instagram link, if you provide one</li>
            <li>Anything you choose to write about your business</li>
          </ul>
          <p>We also collect basic technical information through hosting, security, analytics, and advertising tools. That can include browser type, device information, IP address, referring pages, and general usage activity.</p>
          <h2>2. How we use your information</h2>
          <p>We use the information you submit to review your website or online presence, reply to you, talk about possible website services, improve the site, and protect it from spam or abuse.</p>
          <h2>3. Form submissions</h2>
          <p>Forms are processed through Netlify Forms. Submissions may be stored by Netlify so we can receive and manage your request. Notification emails currently go to kevingoncalo@gmail.com.</p>
          <h2>4. Sharing your information</h2>
          <p>We do not sell your personal information.</p>
          <p>We share limited information with service providers that host the site, process forms, measure traffic, deliver ads, prevent spam, or deliver email. We may also disclose information if required by law or to protect our rights, users, or services.</p>
          <h2>5. Cookies, analytics, and ads</h2>
          <p>This site uses Google Analytics (measurement ID G-LGBZE8QP5E) and a Meta (Facebook) pixel (ID 973776965424046). Those tools may set cookies or similar identifiers to understand visits and to measure advertising. You can control cookies in your browser. Google's and Meta's own policies describe how they handle data they receive.</p>
          <h2>6. Data security</h2>
          <p>We take reasonable steps to protect information submitted through the site. No website, email, or online transmission is completely secure.</p>
          <h2>7. Your choices</h2>
          <p>You can contact us to ask that we update or delete information you submitted, subject to legal, security, or recordkeeping needs.</p>
          <h2>8. Contact</h2>
          <p>For privacy questions, contact <a href="mailto:kevingoncalo@gmail.com">kevingoncalo@gmail.com</a>.</p>
          <p><a class="button button-secondary" href="/">Back to home</a></p>
        </div>
      </section>`
});

pages.push({
  file: "terms/index.html",
  url: "/terms/",
  title: "Terms of Service | AutoDetailingSites.com",
  description: "Terms for using AutoDetailingSites.com, including the free review, the $1,500 website build, payments, ownership, and what is not guaranteed.",
  active: "",
  crumbLabel: "Terms of Service",
  schemas: [{
    "@type": "WebPage",
    name: "Terms of Service",
    url: `${SITE}/terms/`,
    description: "Terms of Service for AutoDetailingSites.com.",
    isPartOf: { "@id": `${SITE}/#website` }
  }],
  body: `<header class="page-hero">
        <div class="container narrow">
          ${crumbsHtml([], "Terms of Service")}
          <!-- TODO: Review with an attorney before relying on this as final legal language. TODO: Kevin, replace kevingoncalo@gmail.com if you switch to a domain email. -->
          <p class="eyebrow">Terms of Service</p>
          <h1>Terms of Service</h1>
          <p class="lede">Last updated: November 11, 2026</p>
        </div>
      </header>
      <section class="band">
        <div class="container narrow legal-card prose">
          <p>These terms explain the basic rules for using AutoDetailingSites.com and requesting website services.</p>
          <h2>1. Website use</h2>
          <p>By using this website, you agree not to misuse the site, attempt to disrupt it, submit false information, or use it for unlawful purposes.</p>
          <h2>2. Free website reviews</h2>
          <p>A free website review is an initial look at the site or online presence you submit, including a Facebook or Instagram page, or the fact that you do not have a site yet. It does not guarantee rankings, leads, sales, or revenue.</p>
          <h2>3. Website build services</h2>
          <p>If you move forward, project details, payment terms, timeline, deliverables, revision limits, and launch requirements should be confirmed before work begins. The standard build on the pricing page is $1,500 and includes one focused revision round unless we agree otherwise in writing.</p>
          <p>Domain registration, hosting, a monthly care plan, and any workmanship guarantee are included only when they are written into the agreement. The pricing page says which of those decisions are still open.</p>
          <h2>4. Payments</h2>
          <p>The standard build price is $1,500, with a $750 deposit to start and a $750 balance due before launch, unless otherwise agreed in writing.</p>
          <p>Deposits may be used to reserve project time and begin work. Refund terms should be confirmed before the project begins.</p>
          <h2>5. Client responsibilities</h2>
          <p>Clients are responsible for accurate business information, service details, logos, photos, account access, booking links, approvals, and any other materials needed to finish the project. Delays in providing those materials can delay the timeline, including the 7-day first draft, which starts only after onboarding materials are complete.</p>
          <h2>6. Third-party tools</h2>
          <p>Websites may use or link to hosting providers, domain registrars, form processors, booking tools, payment tools, analytics, or email services. AutoDetailingSites.com is not responsible for outages, pricing changes, policy changes, or issues caused by those services.</p>
          <h2>7. No guaranteed results</h2>
          <p>We build websites to improve clarity, trust, mobile usability, and quote paths. We do not guarantee traffic, search rankings, leads, bookings, sales, or revenue.</p>
          <h2>8. Intellectual property</h2>
          <p>Client-provided logos, photos, text, and brand materials remain the client's property.</p>
          <p>After the balance is paid, the client may keep and use the finished website for the business it was built for. Website designs, layouts, code, or other materials created by AutoDetailingSites.com may not be copied, resold, or reused for another business without written permission.</p>
          <h2>9. Limitation of liability</h2>
          <p>To the fullest extent allowed by law, AutoDetailingSites.com is not liable for indirect, incidental, or consequential damages resulting from the use of the website or services.</p>
          <h2>10. Changes to these terms</h2>
          <p>We may update these terms from time to time. The updated version will be posted on this page.</p>
          <h2>11. Contact</h2>
          <p>For questions about these terms, contact <a href="mailto:kevingoncalo@gmail.com">kevingoncalo@gmail.com</a>.</p>
          <p><a class="button button-secondary" href="/">Back to home</a></p>
        </div>
      </section>`
});

pages.push({
  file: "thank-you/index.html",
  url: "/thank-you/",
  title: "Review Request Received | AutoDetailingSites.com",
  description: "We received your website review request and will follow up by email.",
  active: "contact",
  robots: "noindex, follow",
  crumbLabel: "Review received",
  schemas: [],
  body: `<header class="page-hero">
        <div class="container narrow thanks-card">
          <p class="eyebrow">Website review</p>
          <h1>Request received.</h1>
          <p>Thanks. We have your request and will follow up by email. If you sent a site or a social page, we will look at that. If you do not have a site yet, we will reply with the next step for starting from scratch.</p>
          <p><a class="button button-primary" href="/">Back to home</a></p>
        </div>
      </header>`
});

pages.push({
  file: "404.html",
  url: "/404.html",
  title: "Page not found | AutoDetailingSites.com",
  description: "That page is not on AutoDetailingSites.com. Visit the home page for pricing, portfolio, and the free review form.",
  active: "",
  robots: "noindex, follow",
  schemas: [],
  body: `<header class="page-hero">
        <div class="container narrow thanks-card">
          <p class="eyebrow">404</p>
          <h1>That page is not here.</h1>
          <p>The link may be old. The current site has a home page, portfolio, pricing, about, contact, a short blog, and notes for Orlando, Tampa Bay, and Providence.</p>
          <p><a class="button button-primary" href="/">Back to home</a></p>
        </div>
      </header>`
});

const titles = new Set();
const descriptions = new Set();
const files = new Map();

for (const page of pages) {
  if (titles.has(page.title)) throw new Error(`Duplicate title: ${page.title}`);
  if (descriptions.has(page.description)) throw new Error(`Duplicate description: ${page.description}`);
  titles.add(page.title);
  descriptions.add(page.description);
  if ((page.description || "").length < 50 || page.description.length > 170) {
    console.warn(`Description length ${page.description.length}: ${page.url}`);
  }
  if (page.title.length > 70) console.warn(`Title length ${page.title.length}: ${page.url}`);
  const html = render(page);
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) throw new Error(`${page.url} has ${h1s.length} h1 tags`);
  if (html.includes('name="keywords"')) throw new Error(`keywords meta in ${page.url}`);
  if (html.includes("60%") || html.includes("Friction rises")) throw new Error(`Removed claim still present in ${page.url}`);
  if (!html.includes("G-LGBZE8QP5E") || !html.includes("973776965424046")) {
    throw new Error(`Missing tracking on ${page.url}`);
  }
  files.set(page.file, html);
}

const known = new Set(pages.map((page) => page.url));
known.add("/favicon.ico");
known.add("/favicon.svg");
known.add("/apple-touch-icon.png");
known.add("/site.webmanifest");
known.add("/styles.css");
known.add("/script.js");
known.add("/og-image.jpg");
known.add("/robots.txt");
known.add("/sitemap.xml");

for (const [file, html] of files) {
  const hrefs = [...html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("data:")) continue;
    const [pathPart, hash] = href.split("#");
    const pathOnly = pathPart.split("?")[0];
    if (!pathOnly.startsWith("/")) throw new Error(`Relative URL in ${file}: ${href}`);
    if (pathOnly === "/") continue;
    if (pathOnly.startsWith("/assets/")) {
      if (!existsSync(join(root, pathOnly))) throw new Error(`Missing asset in ${file}: ${pathOnly}`);
      continue;
    }
    const normalized = pathOnly.endsWith("/") || pathOnly.includes(".") ? pathOnly : `${pathOnly}/`;
    if (!known.has(normalized) && !known.has(pathOnly)) {
      throw new Error(`Unknown internal link in ${file}: ${href}`);
    }
  }
  writeFileSyncSafe(file, html);
}

for (const stale of ["privacy.html", "terms.html", "thank-you.html"]) {
  rmSync(join(root, stale), { force: true });
}

const sitemapUrls = pages
  .filter((page) => !page.robots || page.robots.startsWith("index"))
  .map((page) => `${SITE}${page.url === "/" ? "/" : page.url}`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${DATE}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`Wrote ${files.size} pages and sitemap.xml (${sitemapUrls.length} urls)`);

function writeFileSyncSafe(file, html) {
  const dest = join(root, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html);
}
