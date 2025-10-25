# Movie Streaming Website

## Overview
This project is a fully functional movie and TV series watching website that fetches data from The Movie Database (TMDB) API and uses VidKing embeds for content playback. The website features a modern and vibrant design, ensuring a responsive layout across various devices.

## Project Structure
```
movie-streaming-website
├── src
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── app.js
│   │   ├── watch.js
│   │   └── config.js
│   ├── index.html
│   └── watch.html
├── assets
│   └── icons
├── .gitignore
└── README.md
```

## Features
- **Search Functionality**: Users can search for movies and TV series using a search bar.
- **Dynamic Listings**: The homepage displays listings fetched from the TMDB API based on user searches.
- **Content Playback**: Users can watch selected movies and TV series using VidKing embeds on the watch page.
- **Responsive Design**: The website is designed to be responsive, providing a seamless experience on both desktop and mobile devices.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd movie-streaming-website
   ```
3. Open `src/index.html` in a web browser to view the homepage.
4. Ensure you have a valid TMDB API key and update `src/js/config.js` with your key.

## Usage
- Use the search bar on the homepage to find movies or TV series.
- Click on a listing to navigate to the watch page and view the content.

## License
This project is licensed under the MIT License.