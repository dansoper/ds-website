require('dotenv').config();
const moment = require('moment');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const newwindowlinks = require('./_transforms/newwindowlinks');
const detailtoggles = require('./_transforms/detailtoggles');
const highslideImageShortcode = require('./_shortcodes/image');
const yearShortcode = require('./_shortcodes/year');

module.exports = function (eleventyConfig) {
    eleventyConfig.addLayoutAlias('main', 'ds-2011');

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPassthroughCopy("templates");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("lib");

    eleventyConfig.addFilter("tweetsFilter", obj => {
        return obj.map(a => {
            // This was getting called twice, so we get a boolean and prevent it
            if (a.alreadyFiltered) return a;
            a.alreadyFiltered = true;
            if (a.retweeted_status != null) {
                a.tweetedBy = a.retweeted_status.user.screen_name;
                a.text = a.retweeted_status.text;
                a.urls = a.retweeted_status.entities.urls;
                a.media = a.retweeted_status.entities.media;
                a.retweet_count = a.retweeted_status.retweet_count;
            } else {
                a.tweetedBy = a.user.screen_name;
                a.urls = a.entities.urls;
                a.media = a.entities.media;
            }

            // Make regular URLs in tweets a link
            if (a.urls != null && a.urls.length > 0) {
                a.urls.forEach(url => {
                    let d_url = "";
                    if (url.display_url != null) {
                        d_url = url.display_url;
                    } else {
                        d_url = url.url;
                    }

                    let link = "";
                    if (!url.url.startsWith("https://") && !url.url.startsWith("http://")) {
                        link = "https://" + url.url;
                    } else {
                        link = url.url;
                    }
                    a.text = a.text.replace(url.url, '<a href="' + link + '" target="_blank" rel="nofollow">' + d_url + '</a>');
                });
            }

            // Make media URLS in tweets a link
            if (a.media != null && a.media.length > 0) {
                a.media.forEach(image => {
                    let i_url = "";
                    if (image.display_url != null) {
                        i_url = image.display_url;
                    } else {
                        i_url = image.url;
                    }

                    var regex = new RegExp(image.url, "g");
                    a.text = a.text.replace(regex, '<a href="' + image.url + '" target="_blank" rel="nofollow">' + i_url + '</a>');
                });
            }

            if (a.entities.user_mentions != null && a.entities.user_mentions.length > 0) {
                a.entities.user_mentions.forEach(mention => {
                    var regex = new RegExp('@' + mention.screen_name, "gi");
                    a.text = a.text.replace(regex, '@<a class="userlink" href="https://twitter.com/intent/user?screen_name=' + mention.screen_name + '" rel="nofollow">' + mention.screen_name + '</a>');
                });
            }

            if (a.entities.hashtags != null && a.entities.hashtags.length > 0) {
                a.entities.hashtags.forEach(hashtag => {
                    var regex = new RegExp('#' + hashtag.text, "gi");
                    a.text = a.text.replace(regex, '#<a class="hashlink" href="https://twitter.com/search?q=' + hashtag.text + '" rel="nofollow">' + hashtag.text + '</a>');
                });
            }

            return a;
        });
    });

    eleventyConfig.addFilter("friendlyDate", function (dateObj) {
        return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").locale("en").fromNow();
    });

    eleventyConfig.addFilter("lineBreaksToBr", function (str) {
        return str.replace(/\n/g, "\n<br>");
    });

    eleventyConfig.addTransform("newwindowlinks", newwindowlinks);
    eleventyConfig.addTransform("detailtoggles", detailtoggles);

    eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", highslideImageShortcode);
    eleventyConfig.addShortcode("year", yearShortcode);
};
