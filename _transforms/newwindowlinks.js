const { JSDOM } = require('jsdom');

module.exports = function (rawContent, outputPath) {
    const dom = new JSDOM(rawContent);
    const links = [...dom.window.document.querySelectorAll("a")];
    const hostnames = ["dansoper.co.uk", "danielsoper.co.uk", "djsoper.co.uk"];
    const check = function (obj) {
        var href = obj.href.toLowerCase();
        return (
            (href.indexOf("http://") != -1 && hostnames.filter(hostname => href.indexOf(hostname) != -1).length == 0) ||
            (href.indexOf("https://") != -1 && hostnames.filter(hostname => href.indexOf(hostname) != -1).length == 0) ||
            (href.indexOf('.pdf') !== -1) ||
            (href.indexOf('.png') !== -1)
        ) ? true : false;
    };
    const set = function (obj) {
        obj.target = "_blank";
        obj.className = "external";
    };

    links.forEach(link => {
        if (check(link)) set(link);
    });

    rawContent = dom.serialize();
    return rawContent;
}