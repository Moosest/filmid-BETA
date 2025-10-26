# Filmid — Movie & TV Streaming (Ad-free)

A modern, responsive website for browsing and watching movies and TV shows without ads. Filmid aggregates metadata from The Movie Database (TMDB) and uses VidKing embeds for playback, delivering a clean, distraction-free viewing experience.

## Key Features
- Clean, responsive UI optimized for desktop and mobile.
- Search and discover movies and TV series via TMDB.
- Dynamic listings and detail pages for titles.
- Embedded playback with VidKing for seamless viewing.
- Lightweight front-end only — no server required for basic use.

## Tech Stack
- HTML, CSS, JavaScript
- TMDB API (for metadata)
- VidKing embeds (for playback)

## Contents
```
/src
  /css
    styles.css
  /js
    app.js
    watch.js
    config.js
  index.html
  watch.html
/assets
  /icons
.gitignore
README.md
```

## Installation & Quick Start
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Open the project:
   ```
   cd filmid
   ```
3. Configure your TMDB API key:
   - Edit `src/js/config.js` and set your TMDB API key.
4. Serve or open the site:
   - Open `src/index.html` in a browser, or run a simple static server (recommended):
     ```
     python3 -m http.server 8000
     ```
     Then visit `http://localhost:8000/src/`.

## Configuration
- TMDB API Key: required for search and metadata. Add the key in `src/js/config.js`.
- VidKing: embeds are used as provided; ensure embeds comply with any usage terms.

## Development
- Modify CSS in `src/css/styles.css`.
- Front-end logic in `src/js/app.js` and `src/js/watch.js`.
- Use the browser console and network inspector to debug API calls.

## Contributing
Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests with clear descriptions and tests where applicable.

## License
MIT License — see LICENSE file for details.

## Contact
For questions or feedback, open an issue in this repository.