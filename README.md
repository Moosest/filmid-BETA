## Filmid — Simple Movie & TV Streaming Site (Work in Progress)

I made a simple website for watching movies and TV shows. It’s not finished and still pretty rough, but it works well enough to show the idea. I’m sharing it because maybe someone else will find it useful, just like I did while learning.

## What it is

Search for movies and TV shows using the TMDB API, watch them using VidKing embeds, no ads, clean and minimal design, front-end only, no server required.

## Tech stack

HTML, CSS, JavaScript, TMDB API for movie and series data, VidKing for video embeds.

## Folder structure

/src /css styles.css /js app.js, watch.js, config.js index.html, watch.html /assets /icons .gitignore README.md

## How to run

Clone the repository with git clone <repository-url>, go into the project folder with cd filmid, add your TMDB API key to src/js/config.js, open src/index.html in your browser or run a simple server with python3 -m http.server 8000 and open http://localhost:8000/src/
