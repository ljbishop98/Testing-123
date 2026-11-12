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
