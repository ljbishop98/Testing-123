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

  eleventyConfig.addFilter("byCategory", (items, cat) => items.filter((g) => g.data.category === cat));

  eleventyConfig.addCollection("galleries", (api) =>
    api
      .getFilteredByGlob("src/galleries/*.md")
      .filter((g) => !g.data.hidden)
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
