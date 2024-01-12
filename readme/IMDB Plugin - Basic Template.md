---
up: "[[IMDB]]"
tags:
- #entertainment
id: "{{id}}"
description: "{{{description}}}"
title: "{{{title}}}"
imdbUrl: "{{{imdbUrl}}}"
type: "[[{{type}}]]"
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
cast: "{{{cast}}}"
{{/cast.length}}
---