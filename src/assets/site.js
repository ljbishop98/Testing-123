// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

// Work page category filter (also reads #category from the URL)
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll("#galleryGrid .album");
function applyFilter(cat) {
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === cat)));
  cards.forEach((card) => { card.hidden = cat !== "all" && card.dataset.cat !== cat; });
}
if (chips.length) {
  chips.forEach((c) => c.addEventListener("click", () => {
    applyFilter(c.dataset.filter);
    history.replaceState(null, "", c.dataset.filter === "all" ? location.pathname : "#" + c.dataset.filter);
  }));
  const fromHash = location.hash.slice(1);
  if (fromHash && [...chips].some((c) => c.dataset.filter === fromHash)) applyFilter(fromHash);
}

// Gallery lightbox
const shots = [...document.querySelectorAll(".shot")];
const lb = document.getElementById("lightbox");
if (shots.length && lb) {
  const img = document.getElementById("lbImg");
  const cap = document.getElementById("lbCap");
  let i = 0;
  const show = (n) => {
    i = (n + shots.length) % shots.length;
    img.src = shots[i].dataset.src;
    img.alt = shots[i].querySelector("img").alt;
    cap.textContent = (shots[i].dataset.caption ? shots[i].dataset.caption + " · " : "") + (i + 1) + " / " + shots.length;
  };
  const open = (n) => { show(n); lb.hidden = false; document.body.style.overflow = "hidden"; document.getElementById("lbClose").focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; shots[i].focus(); };
  shots.forEach((s, n) => s.addEventListener("click", () => open(n)));
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", () => show(i - 1));
  document.getElementById("lbNext").addEventListener("click", () => show(i + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
}

// After Kim accepts her admin invite (the link lands on the home page), send her to /admin
window.addEventListener("load", () => {
  const id = window.netlifyIdentity;
  if (!id) return;
  id.on("init", (user) => {
    if (!user) id.on("login", () => { document.location.href = "/admin/"; });
  });
});

// Masthead: size "Knack for Creativity" to fill the page width (from Kim's design)
(function () {
  var h = document.getElementById("mega");
  if (!h) return;
  var spans = h.querySelectorAll(".l");
  var narrow = window.matchMedia("(max-width: 860px)");
  function fit() {
    var avail = h.parentElement.clientWidth;
    h.style.fontSize = "100px";
    var w;
    if (narrow.matches) {
      w = 0;
      spans.forEach(function (s) { w = Math.max(w, s.getBoundingClientRect().width); });
    } else {
      var a = spans[0].getBoundingClientRect(), b = spans[spans.length - 1].getBoundingClientRect();
      w = b.right - a.left;
    }
    if (w > 0) h.style.fontSize = (100 * avail / w * 0.995) + "px";
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("resize", fit);
})();

// "How your day will look": show one chapter at a time as tabs (everything stays visible without JavaScript)
(function () {
  var bar = document.querySelector(".tabs");
  if (!bar) return;
  var tabs = [].slice.call(bar.querySelectorAll(".tab"));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  function select(i, focus) {
    tabs.forEach(function (t, n) {
      t.setAttribute("aria-selected", String(n === i));
      t.tabIndex = n === i ? 0 : -1;
      panels[n].hidden = n !== i;
    });
    panels[i].classList.remove("enter"); void panels[i].offsetWidth; panels[i].classList.add("enter");
    if (focus) tabs[i].focus();
  }
  bar.hidden = false;
  document.body.classList.add("has-tabs");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(i); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") select((i + 1) % tabs.length, true);
      if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length, true);
    });
  });
  select(0);
})();

// Gentle motion: reveal on scroll + slight cover-photo parallax (skipped when the visitor prefers reduced motion)
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  // photos fade in when they've actually loaded, so nothing pops in half-drawn
  document.documentElement.classList.add("motion");
  document.querySelectorAll(".tile img, .masonry img").forEach(function (im) {
    if (im.complete && im.naturalWidth) im.classList.add("loaded");
    else {
      im.addEventListener("load", function () { im.classList.add("loaded"); }, { once: true });
      im.addEventListener("error", function () { im.classList.add("loaded"); }, { once: true });
    }
  });
  var items = document.querySelectorAll(".reveal");
  if (items.length) {
    document.documentElement.classList.add("motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
  var img = document.querySelector(".cover-shot img");
  if (img && window.matchMedia("(min-width: 861px)").matches) {
    img.style.transform = "scale(1.08)";
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        img.style.transform = "translateY(" + (y * 0.08) + "px) scale(1.08)";
        ticking = false;
      });
    }, { passive: true });
  }
})();

// Sticky nav: soft shadow once you scroll, and underline the section you're in
(function () {
  var strip = document.querySelector(".strip");
  if (!strip) return;
  var onScroll = function () { strip.classList.toggle("stuck", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  if (!("IntersectionObserver" in window)) return;
  var links = {};
  strip.querySelectorAll('.nav a[href*="#"]').forEach(function (a) { links[a.getAttribute("href").split("#")[1]] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var a = links[e.target.id];
      if (!a || !e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
      a.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(links).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
})();

// Smooth, eased scrolling for links to sections on the same page (slower and softer than the browser default)
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }; // ease-in-out
  var running = null;
  function scrollToEl(el) {
    var margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    var target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin);
    if (reduce) { window.scrollTo(0, target); return; }
    var start = window.scrollY, dist = target - start;
    var duration = Math.min(1400, Math.max(650, Math.abs(dist) * 0.45));
    var t0 = null;
    if (running) cancelAnimationFrame(running);
    var stop = function () { if (running) { cancelAnimationFrame(running); running = null; } };
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    (function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) running = requestAnimationFrame(step); else running = null;
    })(performance.now());
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href*='#']");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    var el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    history.pushState(null, "", url.hash);
    scrollToEl(el);
  });
})();

// Review form: send in the background and thank them in place (falls back to the thank-you page)
(function () {
  var form = document.querySelector(".review-form");
  if (!form || !window.fetch) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button[type=submit]");
    var msg = form.querySelector(".form-msg");
    btn.disabled = true; btn.textContent = "Sending…";
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.querySelectorAll(".f, .f-row, .check, button").forEach(function (el) { el.hidden = true; });
        msg.textContent = "Thank you! Your review is on its way to Kimberly.";
        msg.hidden = false;
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Send review";
        msg.textContent = "That didn't send. Please check your connection and try again.";
        msg.hidden = false;
      });
  });
})();
