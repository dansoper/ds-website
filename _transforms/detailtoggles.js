module.exports = function (rawContent, outputPath) {
    let matchCount = 0;
    let growingScript = "";
    /*const regex = /\{dt_head\}([^\{]*)\{dt_details\}([^\{]*)\{dt_end\}/isg;*/
    const regex = /\{dt_more_details\}([^\{]*)\{dt_end\}/isg;
    const matched = rawContent.matchAll(regex);
    if (matched != null) {
        let matches = [...matched];
        for (let i = 0; i < matches.length; i++) {
            matchCount++;
            let newHtml = ` <a href="#" id="dt_title_${matchCount}" class="small">`;
            newHtml += `(more)`;
            newHtml += `</a><div id="vs_${matchCount}"><div>`;
            newHtml += matches[i][1];
            newHtml += "</div></div>";

            rawContent = rawContent.replace(matches[i][0], newHtml);

            growingScript += `if(document.getElementById('vs_${matchCount}')){slideUp(document.getElementById('vs_${matchCount}'),0);var clickEl=document.getElementById('dt_title_${matchCount}');clickEl.addEventListener('click',function(e){slideToggle(document.getElementById('vs_${matchCount}'));e.preventDefault();});}`;
        }
    }

    if (!rawContent.includes("src=\"/lib/slideupdown/slideupdown.js\"")) {
        rawContent = rawContent.replace("</body>", `<script src=\"/lib/slideupdown/slideupdown.js\"></script></body>`);
    }
    rawContent = rawContent.replace("</body>", `<script>${growingScript}</script></body>`);

    return rawContent;
}