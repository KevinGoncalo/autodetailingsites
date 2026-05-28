const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealGroups = [
  [".problem-intro", ".cost-visual-card", ".problem-bridge"],
  [".problem-card"],
  [".included-copy", ".site-mockup"],
  [".cta-band"],
  [".demo-visual", ".demo-copy"],
  ["#process .section-heading"],
  [".process-list li"],
  [".pricing-copy", ".pricing-card"],
  ["#why-this-works .section-heading", ".conversion-flow"],
  ["#faq .section-heading"],
  [".faq-list details"],
  [".contact-copy", ".contact-form-card"],
  [".footer-brand", ".footer-column", ".footer-bottom"]
];

const revealEls = [];

revealGroups.forEach((selectors) => {
  selectors.forEach((selector, index) => {
    document.querySelectorAll(selector).forEach((el, itemIndex) => {
      const delay = Math.min((index + itemIndex) % 5, 4);
      el.classList.add("reveal");
      if (delay > 0) {
        el.classList.add(`reveal-delay-${delay}`);
      }
      revealEls.push(el);
    });
  });
});

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
