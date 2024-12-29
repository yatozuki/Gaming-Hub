import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import compression from 'compression';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression()); // Enable Gzip compression


const DATA_FILE = path.join(__dirname, 'data/games.json');
const PRICES_CACHE_FILE = path.join(__dirname, 'data/prices.json');

const loadGameData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty if file doesn't exist
    }
};

const saveGameData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};


// Load price cache
const loadPriceCache = async () => {
    try {
        const data = await fs.readFile(PRICES_CACHE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
};

// Save price cache
const savePriceCache = async (data) => {
    await fs.writeFile(PRICES_CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Fetch prices for a batch of games
const fetchPricesForGames = async (games) => {
    const priceCache = await loadPriceCache();
    const currentTime = Date.now();
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const gamesToFetch = games.filter(game => {
        const cachedData = priceCache[game.appid];
        return !cachedData || (currentTime - cachedData.timestamp) > CACHE_DURATION;
    });

    // Fetch prices in batches to avoid overwhelming the API
    const BATCH_SIZE = 10;
    for (let i = 0; i < gamesToFetch.length; i += BATCH_SIZE) {
        const batch = gamesToFetch.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (game) => {
            try {
                const url = `https://store.steampowered.com/api/appdetails?appids=${game.appid}&filters=price_overview`;
                const response = await axios.get(url);
                
                if (response.data[game.appid]?.success) {
                    const priceData = response.data[game.appid].data?.price_overview;
                    priceCache[game.appid] = {
                        price: priceData ? priceData.final_formatted : 'Free',
                        timestamp: currentTime
                    };
                }
            } catch (error) {
                console.error(`Error fetching price for game ${game.appid}:`, error.message);
            }
        }));

        // Add a small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await savePriceCache(priceCache);
    return priceCache;
};


app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 30;
    const searchQuery = req.query.search?.trim().toLowerCase() || '';
    
    let cachedGames = await loadGameData();

    if (cachedGames.length === 0) {
        try {
            const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
            const response = await axios.get(url);
            const games = response.data.applist.apps;
            
            cachedGames = games.filter(game => game.name.trim() !== '').map(game => ({
                appid: game.appid,
                name: game.name.trim(),
            }));
            
            await saveGameData(cachedGames);
        } catch (err) {
            return res.send('Error fetching game list');
        }
    }

    const filteredGames = cachedGames.filter(game =>
        game.name.toLowerCase().includes(searchQuery)
    );
    const totalGames = filteredGames.length;
    const allPages = Math.ceil(totalGames / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedGames = filteredGames.slice(start, start + pageSize);
    const priceCache = await fetchPricesForGames(paginatedGames);
    
    const gamesWithPrices = paginatedGames.map(game => ({
       ...game,
       price: priceCache[game.appid]?.price || 'N/A'
   }));
    res.render('home', {
        games: gamesWithPrices,
        currentPage: page,
        totalPages: allPages,
        searchQuery: searchQuery || null,
    });
});



const GAME_DETAILS_CACHE = path.join(__dirname, 'data/gameDetails.json');

// Utility function to load cached game details
const loadGameDetailsCache = async () => {
    try {
        const data = await fs.readFile(GAME_DETAILS_CACHE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {}; // Return an empty object if file doesn't exist
    }
};

// Utility function to save cached game details
const saveGameDetailsCache = async (cache) => {
    await fs.writeFile(GAME_DETAILS_CACHE, JSON.stringify(cache, null, 2), 'utf-8');
};

app.get('/game/:id', async (req, res) => {
    const appId = req.params.id;
    const searchQuery = req.query.search?.trim() || '';

    try {
        // Load cached game details
        const cache = await loadGameDetailsCache();

        // Check if game details are already cached
        if (cache[appId]) {
            return res.render('details', { ...cache[appId], searchQuery });
        }

        // Fetch game details from Steam API
        const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
        const response = await axios.get(url);

        if (!response.data[appId]?.success) {
            // res.send('Error: Game details could not be retrieved (success is false).');
            res.redirect('/');
            return;
        }

        const data = response.data[appId]?.data || {};

        const videos = (data.movies || []).map(movie => ({
            webm: movie.webm ? movie.webm[480] : null,
            mp4: movie.mp4 ? movie.mp4[480] : null,
        })).filter(video => video.webm || video.mp4);

        const gameDetails = {
            appid: appId,
            name: data.name || null,
            genre: data.genres ? data.genres.map(g => g.description).join(', ') : null,
            description: data.short_description || null,
            price: data.is_free ? 'Free' : (data.price_overview?.final_formatted || null),
            release_date: data.release_date?.date || null,
            platforms: data.platforms
                ? Object.keys(data.platforms)
                      .filter(p => data.platforms[p])
                      .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
                : null,
            publisher: data.publishers ? data.publishers.join(', ') : null,
            developer: data.developers ? data.developers.join(', ') : null,
            screenshots: data.screenshots ? data.screenshots.map(s => s.path_full) : [],
            videos: videos,
        };

        // Cache the fetched details
        cache[appId] = gameDetails;
        await saveGameDetailsCache(cache);

        res.render('details', { ...gameDetails, searchQuery });
    } catch (err) {
        console.error(err);
        res.send('Error fetching game details.');
    }
});


app.listen(port, () => console.log(`Server is running on port: ${port}`));
