/*
 * The one motion level that needs script: scroll reveal. It is skipped under
 * prefers-reduced-motion and never hides content already on screen: only elements
 * below the fold at load are armed. Numbers are never animated; exact values are in
 * the HTML from the first paint.
 */
const EASE = "cubic-bezier(.22,.61,.24,1)";
const REVEAL = ".proj-viz, .moment, .statement, .section-head, .sysfull, .instrument";

export function initMotion({ motion }) {
  if (!motion() || !("IntersectionObserver" in window)) return;
  reveals();
}

/* Level 2: scroll reveal, below-the-fold elements only. */
function reveals() {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
        { duration: 460, easing: EASE, fill: "backwards" });
      el.classList.remove("rv");
      el.classList.add("seen");
      o.unobserve(el);
    });
  }, { rootMargin: "0px 0px -6%", threshold: 0.05 });
  const vh = window.innerHeight;
  document.querySelectorAll(REVEAL).forEach((el) => {
    if (el.getBoundingClientRect().top <= vh) return; /* already visible or passed: never hide it */
    el.classList.add("rv");
    obs.observe(el);
  });
}
