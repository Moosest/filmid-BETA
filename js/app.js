import { TMDB_API_KEY, BASE_URL, IMG_PATH } from './config.js';

if (!BASE_URL || !IMG_PATH || !TMDB_API_KEY) {
    console.error('Missing config values (BASE_URL, IMG_PATH or TMDB_API_KEY) in config.js');
    // Do not throw to avoid total crash in the browser; show errors instead.
}

const API_ENDPOINTS = {
    SEARCH: `${BASE_URL}/search/multi`,
    TRENDING: `${BASE_URL}/trending`
};

const PLACEHOLDER_IMG = '/assets/placeholder-poster.jpg';

const elements = {
    get searchBar() {
        return document.querySelector('.search-bar');
    },
    get searchWrapper() {
        // prefer .search-wrapper for dropdown positioning, fallback to .search-container
        return document.querySelector('.search-wrapper') || document.querySelector('.search-container');
    },
    get movieGrid() {
        return document.getElementById('movieGrid') || document.querySelector('.movie-grid');
    }
};

const SEARCH_CONFIG = {
    MIN_CHARS: 3,
    DEBOUNCE_MS: 400
    // MAX_RESULTS removed since we'll show all results
};

const debounce = (fn, wait = 300) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
};

const buildUrl = (endpoint, params = {}) => {
    try {
        const url = new URL(endpoint);
        const searchParams = new URLSearchParams(params);
        if (TMDB_API_KEY) searchParams.set('api_key', TMDB_API_KEY);
        url.search = searchParams.toString();
        return url.toString();
    } catch (err) {
        console.error('Invalid endpoint URL:', endpoint, err);
        return endpoint;
    }
};

const fetchFromAPI = async (endpoint, params = {}) => {
    const url = buildUrl(endpoint, params);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('fetchFromAPI failed:', err, url);
        throw err;
    }
};

const showSearchFeedback = (message, { loading = false } = {}) => {
    const wrapper = elements.searchWrapper;
    if (!wrapper) return;
    removeDropdown();
    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    const inner = document.createElement('div');
    inner.className = `search-feedback${loading ? ' loading' : ''}`;
    if (loading) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        inner.appendChild(spinner);
    }
    const p = document.createElement('p');
    p.textContent = message;
    inner.appendChild(p);
    dropdown.appendChild(inner);
    wrapper.appendChild(dropdown);
};

const removeDropdown = () => {
    document.querySelectorAll('.search-results-dropdown').forEach(d => d.remove());
};

const createResultElement = (item) => {
    if (!item?.id || !item?.media_type || !['movie', 'tv'].includes(item.media_type)) {
        return null;
    }

    // Ensure we have the TMDB ID
    const tmdbId = item.id.toString();
    const mediaType = item.media_type;
    const title = item.title || item.name || 'Untitled';
    const posterPath = item.poster_path ? `${IMG_PATH}${item.poster_path}` : PLACEHOLDER_IMG;
    const rating = (typeof item.vote_average === 'number') ? item.vote_average.toFixed(1) : 'N/A';
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';

    const card = document.createElement('div');
    card.className = 'movie-card search-result-item';
    // Store TMDB ID and media type in data attributes
    card.dataset.id = tmdbId;
    card.dataset.type = mediaType;

    const posterWrapper = document.createElement('div');
    posterWrapper.className = 'movie-poster-wrapper';
    const img = document.createElement('img');
    img.className = 'movie-poster';
    img.loading = 'lazy';
    img.alt = title;
    img.src = posterPath;
    img.onerror = () => { img.src = PLACEHOLDER_IMG; };
    posterWrapper.appendChild(img);

    const info = document.createElement('div');
    info.className = 'movie-info';
    const h3 = document.createElement('h3');
    h3.className = 'movie-title';
    h3.textContent = title;
    const meta = document.createElement('div');
    meta.className = 'movie-meta';
    const spanYear = document.createElement('span');
    spanYear.className = 'movie-year';
    spanYear.textContent = year;
    const spanRating = document.createElement('span');
    spanRating.className = 'movie-rating';
    spanRating.textContent = `⭐ ${rating}`;
    meta.appendChild(spanYear);
    meta.appendChild(spanRating);

    info.appendChild(h3);
    info.appendChild(meta);

    card.appendChild(posterWrapper);
    card.appendChild(info);

    return card;
};

// Removed the createShowMoreElement function since it's no longer needed

const displayResults = (results = []) => {
    const wrapper = elements.searchWrapper;
    if (!wrapper) {
        console.error('No search wrapper/container present to show results in.');
        return;
    }

    removeDropdown();

    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    
    const resultsList = document.createElement('div');
    resultsList.className = 'search-results-list';
    
    // Show all valid results at once
    const validResults = results
        .filter(item => item && ['movie', 'tv'].includes(item.media_type))
        .map(createResultElement)
        .filter(Boolean);

    if (!validResults.length) {
        showSearchFeedback('No valid results found');
        return;
    }

    // Display all results
    resultsList.append(...validResults);
    dropdown.appendChild(resultsList);
    wrapper.appendChild(dropdown);

    // event delegation: handle clicks inside dropdown
    dropdown.addEventListener('click', async (ev) => {
        const card = ev.target.closest('.movie-card');
        if (card) {
            ev.preventDefault();
            const tmdbId = card.dataset.id;
            const mediaType = card.dataset.type;
            
            if (!tmdbId || !mediaType) {
                console.error('Missing TMDB ID or media type:', card);
                return;
            }

            window.location.href = `watch.html?id=${tmdbId}&type=${mediaType}`;
        }
    });
};

const searchMovies = async (searchTerm) => {
    const wrapper = elements.searchWrapper;
    if (!wrapper) {
        console.error('No search container to attach results to.');
        return;
    }

    if (!searchTerm) {
        removeDropdown();
        return;
    }

    if (searchTerm.length < SEARCH_CONFIG.MIN_CHARS) {
        showSearchFeedback('Keep typing to search...');
        return;
    }

    showSearchFeedback('Searching...', { loading: true });

    try {
        const data = await fetchFromAPI(API_ENDPOINTS.SEARCH, {
            query: searchTerm,
            include_adult: false,
            language: 'en-US',
            page: 1
        });

        const results = data?.results || [];
        displayResults(results);
    } catch (err) {
        console.error('Search failed', err);
        showSearchFeedback('Search failed. Please try again.');
    }
};

const handleSearch = debounce((ev) => {
    const q = ev.target?.value?.trim() || '';
    searchMovies(q);
}, SEARCH_CONFIG.DEBOUNCE_MS);

const initSearch = () => {
    const input = elements.searchBar;
    if (!input) {
        console.error('Search bar (.search-bar) not found in DOM.');
        return;
    }
    input.removeEventListener('input', handleSearch); // safe remove
    input.addEventListener('input', handleSearch);

    // close dropdown when clicking outside the search wrapper
    document.addEventListener('click', (ev) => {
        const wrapper = elements.searchWrapper;
        if (!wrapper) return;
        if (!ev.target.closest('.search-wrapper') && !ev.target.closest('.search-container')) {
            removeDropdown();
        }
    });

    // press Escape to close dropdown
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') removeDropdown();
    });
};

// Replace previous loadInitialContent — do NOT inject example/trending items on page load.
// This keeps the #movieGrid empty until the user searches or navigates elsewhere.
const loadInitialContent = async () => {
    const grid = elements.movieGrid;
    if (!grid) return;

    // Clear any pre-existing content so the grid is empty on initial load.
    grid.innerHTML = '';
};

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    // keep loadInitialContent call if you want the empty state; it no longer injects movies
    loadInitialContent();
});