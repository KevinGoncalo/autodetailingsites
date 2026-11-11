(function () {
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!nodes.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
  );

  nodes.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      el.classList.add("is-visible");
      return;
    }
    observer.observe(el);
  });

  document.documentElement.classList.add("reveal-ready");
})();
