import { imageSize as sizeOf } from "image-size";
import { readFile } from "node:fs/promises";

// Eleventy config — builds src/ into _site/ (Netlify runs this on every save from /admin).
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.ignores.add("src/admin/**");

  // Turn a site path ("/images/x.jpg", "work.html") into a link relative to the current page,
  // so the site works at any address (Netlify, custom domain, or a sub-folder preview).
  eleventyConfig.addFilter("rel", (target, pageUrl) => {
    if (!target) return "";
    if (/^(https?:|mailto:|tel:|#|data:)/.test(target)) return target;
    const clean = String(target).replace(/^\//, "");
    const depth = (pageUrl || "/").split("/").length - 2;
    return (depth > 0 ? "../".repeat(depth) : "") + clean;
  });

  // width/height for a photo, so the browser saves its space before it loads (no jumping while scrolling).
  // Works for uploaded photos and remote ones; if a size can't be read, the photo still shows normally.
  const dimsCache = new Map();
  eleventyConfig.addAsyncFilter("dims", async (src) => {
    if (!src) return "";
    if (dimsCache.has(src)) return dimsCache.get(src);
    let out = "";
    try {
      let buf;
      if (/^https?:/.test(src)) {
        const res = await fetch(src, { headers: { Range: "bytes=0-131071" }, signal: AbortSignal.timeout(8000) });
        buf = Buffer.from(await res.arrayBuffer());
      } else {
        buf = await readFile("src/" + String(src).replace(/^\//, ""));
      }
      const d = sizeOf(buf);
      if (d && d.width && d.height) out = `width="${d.width}" height="${d.height}"`;
    } catch (e) { /* leave it to the browser */ }
    dimsCache.set(src, out);
    return out;
  });

  eleventyConfig.addFilter("year", (d) => {
    if (!d) return "";
    const date = d === "now" ? new Date() : new Date(d);
    return String(date.getUTCFullYear());
  });

  // *word* in admin text becomes italic, as in Kim's "Let's talk about *your* day"
  eleventyConfig.addFilter("em", (t) =>
    String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\*(.+?)\*/g, "<em>$1</em>"));

  eleventyConfig.addFilter("roman", (n) =>
    ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][n - 1] || String(n));

  // Contact-sheet tile sizes, following Kim's layouts for 4, 5 and 6 photos
  eleventyConfig.addFilter("tileSpan", (i, count) => {
    const layouts = {
      4: ["h2", "w2", "h2", "w2"],
      5: ["w2 h2", "", "", "", ""],
      6: ["w2 h2", "h2", "", "", "w2", "w2"],
    };
    const l = layouts[count] || layouts[6];
    return l[i % l.length];
  });

  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  // Home page: galleries she switched on, newest first; falls back to the newest three
  eleventyConfig.addFilter("homeGalleries", (arr) => {
    const picked = (arr || []).filter((g) => g.data.featured);
    return (picked.length ? picked : arr || []).slice(0, 3);
  });

  eleventyConfig.addFilter("byCategory", (items, cat) => items.filter((g) => g.data.category === cat));

  eleventyConfig.addCollection("galleries", (api) =>
    api
      .getFilteredByGlob("src/galleries/*.md")
      .filter((g) => !g.data.hidden)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
