---
type: <%*
function formatType() {
    let type = "{{{type}}}";
    if (type == "movie") {
	   type = "Movies";
    } else if (type == "videogame") {
       type = "Video Games";
    } else if (type == "tvSeries" || type == "tvMiniSeries") {
	   type = "Series";
    }
    return `"[[${type}]]"`
}
tR += formatType();
%>
related: 
poster: "{{{poster}}}"
imdbId: "{{{id}}}"
scoreImdb: {{imdbRating}}
length: "{{runtimeMin}}"
genre:<%*
function formatGenres() {
    let input = "{{{genres}}}";
    return input.split(",").map(i => `\n- "[[${i.trim()}]]"`).join("");
}
tR += formatGenres();
%>
{{#cast.length}}
cast:<%*
function formatCast() {
    let input = "{{{cast}}}";
    return input.split(",").map(i => `\n- "[[${i.trim()}]]"`).join("");
}
tR += formatCast();
%>
{{/cast.length}}
{{#directors.length}}
director:<%*
function formatDirectors() {
    let input = "{{{directors}}}";
    return input.split(",").map(i => `\n- "[[${i.trim()}]]"`).join("");
}
tR += formatDirectors();
%>
{{/directors.length}}
{{#writers.length}}
writer:<%*
function formatWriters() {
    let input = "{{{writers}}}";
    return input.split(",").map(i => `\n- "[[${i.trim()}]]"`).join("");
}
tR += formatWriters();
%>
{{/writers.length}}
plot: "{{{description}}}"
year: {{year}}
group:
yearXP: 
yearXPL: 
rating: {{{yourRating}}}
---
