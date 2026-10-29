/*
 * Case-study sections. Each section has its own address, /p/<id>/<section>/,
 * served as a real page, so it survives refresh and sharing. With script, the
 * on-page index moves between sections without a reload, records history, and
 * tracks the section being read.
 */
export function initCaseNav({ motion }) {
  const view = document.querySelector(".view[data-case]");
  if (!view) return;
  const id = view.dataset.case;
  const base = view.dataset.base;
  const toc = view.querySelector(".toc");
  const section = (key) => document.getElementById(`s-${id}-${key}`);
  const keyFromPath = () => decodeURIComponent(location.pathname.slice(base.length)).replace(/\/+$/, "");

  function go(key, smooth) {
    const s = section(key);
    if (!s) return;
    s.scrollIntoView({ behavior: smooth && motion() ? "smooth" : "auto", block: "start" });
    const h = s.querySelector(".sec-h");
    if (h) h.focus({ preventScroll: true });
  }

  if (toc) {
    toc.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-sec]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const key = a.dataset.sec;
      if (keyFromPath() !== key) history.pushState({ sec: key }, "", base + key + "/");
      go(key, true);
    });
  }

  /* Opened at a section address (or refreshed there): start at that section. */
  if (view.dataset.section) requestAnimationFrame(() => go(view.dataset.section, false));

  window.addEventListener("popstate", () => {
    const key = keyFromPath();
    if (key && section(key)) go(key, false);
  });

  /*
   * Scroll spy: the index marks the section occupying the reading line, nothing while the
   * reader is above the first section, and the last section once the page can scroll no
   * further (a short final section never reaches the line on its own).
   */
  if (toc) {
    const links = Array.from(toc.querySelectorAll("a[data-sec]"));
    const secs = Array.from(view.querySelectorAll(".case-sec"));
    let queued = false;
    const mark = () => {
      queued = false;
      const line = innerHeight * 0.3;
      let key = "";
      for (const s of secs) if (s.getBoundingClientRect().top <= line) key = s.dataset.sec;
      if (key && innerHeight + scrollY >= document.documentElement.scrollHeight - 2) key = secs[secs.length - 1].dataset.sec;
      links.forEach((a) => {
        if (a.dataset.sec === key) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(mark); } };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    mark();
  }
}
