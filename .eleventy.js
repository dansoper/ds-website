require('dotenv').config();
const moment = require('moment');
const cleanCss = require('clean-css');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const newwindowlinks = require('./_transforms/newwindowlinks');
const detailtoggles = require('./_transforms/detailtoggles');
const highslideImageShortcode = require('./_shortcodes/image');
const yearShortcode = require('./_shortcodes/year');
const gitLastCommitDate = require('./_shortcodes/git-date');
const { minify } = require("terser");

module.exports = function (eleventyConfig) {
    eleventyConfig.addGlobalData("layout", "main");

    eleventyConfig.addLayoutAlias('main', 'ds-2011');

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPassthroughCopy("templates");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("lib");
    eleventyConfig.addPassthroughCopy("santa2025");
    eleventyConfig.addPassthroughCopy("_redirects");
    eleventyConfig.addPassthroughCopy("robots.txt");

    eleventyConfig.addFilter("friendlyDate", function (dateObj) {
        return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").locale("en").fromNow();
    });

    eleventyConfig.addFilter("dateObjectToYmd", function (dateObj) {
        return moment(dateObj).format("YYYYMMDD");
    });
    eleventyConfig.addFilter("dateObjectToYmdHyphen", function (dateObj) {
        return moment(dateObj).format("YYYY-MM-DD");
    });
    eleventyConfig.addFilter("dateObjectToYm", function (dateObj) {
        return moment(dateObj).format("YYYYMM");
    });
    eleventyConfig.addFilter("dateObjectToShortDate", function (dateObj) {
        return moment(dateObj).format("ddd Do MMM YYYY");
    });
    eleventyConfig.addFilter("dateObjectToShortDateTime", function (dateObj) {
        return moment(dateObj).format("ddd Do MMM YYYY HH:mm");
    });
    eleventyConfig.addFilter("numberOfDaysSince", function (dateObj, since) {
        if (dateObj == null || dateObj == "") return moment().diff(moment(since, "YYYYMMDD"), "days");
        return moment(dateObj).diff(moment(since, "YYYYMMDD"), "days");
    });
    eleventyConfig.addFilter("addDaysToDate", function (dateObj, add) {
        if (dateObj == null || dateObj == "") return "";
        return moment(dateObj).add(add, "days");
    });

    eleventyConfig.addFilter("lineBreaksToBr", function (str) {
        return str.replace(/\n/g, "\n<br>");
    });

    eleventyConfig.addFilter("cssmin", function (code) {
        return new cleanCss({}).minify(code).styles;
    });

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
        try {
          const minified = await minify(code);
          callback(null, minified.code);
        } catch (err) {
          console.error("Terser error: ", err);
          // Fail gracefully.
          callback(null, code);
        }
    });

    eleventyConfig.addFilter("unique", arr => arr instanceof Array && arr.filter((e, i, arr) => arr.indexOf(e) == i) || arr);

    function filterTagList(tags) {
        return (tags || []).filter(tag => ["blog"].indexOf(tag) === -1);
      }
    
    eleventyConfig.addFilter("filterTagList", filterTagList)

    // Create an array of all tags
    eleventyConfig.addCollection("tagList", function(collection) {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });
        return filterTagList([...tagSet]);
    });

    eleventyConfig.addTransform("newwindowlinks", newwindowlinks);
    eleventyConfig.addTransform("detailtoggles", detailtoggles);

    eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", highslideImageShortcode);
    eleventyConfig.addNunjucksAsyncShortcode("gitLastCommitDate", gitLastCommitDate);
    eleventyConfig.addShortcode("year", yearShortcode);
};
