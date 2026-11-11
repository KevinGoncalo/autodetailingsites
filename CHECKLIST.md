# Placeholders for Kevin

Search the repo for `TODO` until each item is either filled or deliberately removed. Do not invent a testimonial, a city, a photo, or a price.

The HTML files are what Netlify publishes. Edit those files. `scripts/build.mjs` can regenerate every page and will overwrite hand edits, so do not run it after you start filling these in.

## Must fill

1. **Photo.** Add a real photo of Kevin Goncalo on `about/index.html` and on the founder block in `index.html`. Do not use a stock portrait.
2. **City.** On `about/index.html`, add the city you want listed. The site currently says only that you are based in the United States.
3. **Bio.** On `about/index.html`, add a short bio with facts you want public. Years of experience and past work are blank on purpose.
4. **Domain email.** The public address is `kevingoncalo@gmail.com`. When a domain email exists, replace it on `contact/index.html`, `privacy/index.html`, `terms/index.html`, and in the JSON-LD on the home and about pages.
5. **Phone.** On `contact/index.html`, add a number you answer, or delete the placeholder. There is no number on the site.
6. **Calendar link.** On `contact/index.html`, add a scheduling link you control, or delete the placeholder. Do not publish a fake booking URL.
7. **Care plan price.** On `pricing/index.html`, replace `$TODO` with the monthly price and write what the month includes.
8. **SEI testimonial.** Ask SEI Auto Detailing (Warwick, RI) for a sentence they approve, and the name they want credited. Put it in `index.html` and `portfolio/index.html`. Do not write the quote yourself.
9. **Hosting and domain.** On `pricing/index.html`, replace the placeholder with the real policy: who registers the domain, whose account it lives in, where the site is hosted, what it costs, and who pays renewal. Until then, domain and hosting are not part of the $1,500.

## Decide, then edit

10. **Ownership sentence.** `pricing/index.html` and `terms/index.html` say the client keeps the finished site for that business, and the design is not licensed for resale. Confirm this matches the agreement you send.
11. **Guarantee.** There is no rankings or leads guarantee. If you want a workmanship or fix-period guarantee, write it on `pricing/index.html`. If you do not, delete that TODO.
12. **Legal review.** Privacy and terms are starter language. Have an attorney review them before you rely on them. The privacy policy now names Google Analytics `G-LGBZE8QP5E` and Meta pixel `973776965424046`.

## Netlify form notification emails

The review form is named `website-review`. It appears on the home page and the contact page, posts to `/thank-you/`, and includes a honeypot field named `company_website`. The website URL is optional. "I don't have a site yet" and "I only use Facebook or Instagram" are choices.

After this branch is deployed:

1. Open the Netlify site that publishes this repo.
2. Submit a test from the contact form, including one test where you choose "I don't have a site yet" and leave the link blank.
3. In Netlify, go to **Site configuration > Forms** and confirm `website-review` is listed. Forms are detected from the HTML at deploy time. A new field shows up after the deploy that contains it.
4. Go to **Site configuration > Notifications > Form submission notifications > Email notification**.
5. Send notifications to `kevingoncalo@gmail.com` (or the domain email, once it exists).
6. Choose the form `website-review` and save.
7. Submit one more test and confirm the email arrives. Check spam the first time.
8. If you rename the form later, add the notification again. The name has to match.

Form submissions from a deploy preview are tied to that deploy. Test again on production after you merge, if you use a preview first.
