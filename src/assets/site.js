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
const cards = document.querySelectorAll("#galleryGrid .card");
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
