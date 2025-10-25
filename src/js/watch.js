import { TMDB_API_KEY, BASE_URL } from './config.js';

// Constants
const API_ENDPOINTS = {
    MOVIE: `${BASE_URL}/movie`,
    TV: `${BASE_URL}/tv`
};

const EMBED_URLS = {
    MOVIE: 'https://www.vidking.net/embed/movie',
    TV: 'https://www.vidking.net/embed/tv'
};

// Elements
const videoPlayer = document.getElementById('videoPlayer');
const videoDetails = document.getElementById('videoDetails');

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type')?.toLowerCase();

async function loadContent() {
    if (!id || !type || !['movie', 'tv'].includes(type)) {
        showError('Invalid content parameters');
        return;
    }

    try {
        // Load content details from TMDB
        const response = await fetch(
            `${API_ENDPOINTS[type.toUpperCase()]}/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        
        if (!response.ok) throw new Error('Content not found');
        const data = await response.json();

        // Create embed URL based on content type
        const embedUrl = type === 'movie' 
            ? `${EMBED_URLS.MOVIE}/${id}`
            : `${EMBED_URLS.TV}/${id}/1/1`; // Default to S1E1 for TV shows

        // Insert video player iframe
        videoPlayer.innerHTML = `
            <iframe
                src="${embedUrl}"
                width="100%"
                height="100%"
                frameborder="0"
                allowfullscreen
                allow="autoplay; encrypted-media"
            ></iframe>
        `;

        // Display content details
        displayContentDetails(data);
    } catch (error) {
        showError('Failed to load content');
        console.error('Error:', error);
    }
}

function displayContentDetails(data) {
    // Update page title
    document.title = `${data.title || data.name} - PotsiFilmiKoobas`;
    
    // Display content information
    videoDetails.innerHTML = `
        <h1>${data.title || data.name}</h1>
        <div class="meta">
            <span>${data.release_date || data.first_air_date || 'N/A'}</span>
            <span>⭐ ${data.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
        <p>${data.overview || 'No description available.'}</p>
    `;
}

function showError(message) {
    videoDetails.innerHTML = `<div class="error">${message}</div>`;
    videoPlayer.innerHTML = '';
}

// Add CSS to ensure the video player maintains 16:9 aspect ratio
const style = document.createElement('style');
style.textContent = `
    .video-player {
        position: relative;
        padding-top: 56.25%; /* 16:9 Aspect Ratio */
        background: var(--card-bg);
    }
    .video-player iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);