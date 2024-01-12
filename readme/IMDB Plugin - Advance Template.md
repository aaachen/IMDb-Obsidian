---
id: "{{id}}"
description: "{{{description}}}"
title: "{{{title}}}"
imdbUrl: "{{{imdbUrl}}}"
type: <%*
function formatType() {
    let type = "{{{type}}}";
    if (type == "movie") {
	   type = "Movies";
    } else if (type == "videoGame") {
       type = "Games";
    } else if (type == "tvSeries" || type == "tvMiniSeries") {
	   type = "TV Series";
    }
    return `"[[${type}]]"`
}
tR += formatType();
%>
poster: "{{{poster}}}"
scoreImdb: {{imdbRating}}
length: "{{runtimeMin}}"
year: {{year}}
releaseDate: {{{releaseDate}}}
genre: "{{{genres}}}"
votes: {{votes}}
{{#directors.length}}
director: {{{directors}}}
{{/directors.length}}
{{#writers.length}}
writer: {{{writers}}}
{{/writers.length}}
{{#cast.length}}
cast:<%*
function formatCast() {
    let cast = "{{{cast}}}";
    return cast.split(",").map(c => `- "[[${c.trim()}]]"\n`).join("");
}
tR += "\n" + formatCast();
%>
{{/cast.length}}
---
