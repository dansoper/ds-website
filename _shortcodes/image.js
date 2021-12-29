const Image = require("@11ty/eleventy-img");


async function highslideImageShortcode(src, alt, className, size=200) {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [size,null],
        formats: ["jpeg"],
        outputDir: "./_site/images",
        urlPath: "/images"
    });
  
    let shrunk = metadata.jpeg[0];
    let full = metadata.jpeg[1];
    return `<a href="${full.url}" class="highslide" onclick="return hs.expand(this)"><img src="${shrunk.url}" width="${shrunk.width}" height="${shrunk.height}" alt="${alt}" loading="lazy" decoding="async" class="${className}"></a>`;
}
  
module.exports = highslideImageShortcode;
