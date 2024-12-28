import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'node:path';
import {
    dirname
} from 'node:path';
import {
    fileURLToPath
} from 'node:url';

const __dirname = dirname(fileURLToPath(
    import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    console.log(`const page = ${page}`); // LOG

    const pageSize = 30;
    const searchQuery = req.query.search || '';
    try {
        const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
        const response = await axios.get(url);
        const games = response.data.applist.apps;

        const filteredGames = games.filter(game =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const totalGames = filteredGames.length;
        const allPages = Math.ceil(totalGames / pageSize);

        const start = (page - 1) * pageSize;
        console.log("start " + start); //LOG

        const end = Math.min(start + pageSize, totalGames);
        console.log("end " + end); //LOG

        const paginatedGames = filteredGames.slice(start, end);
        console.log(paginatedGames); //LOG

        res.render('home', {
            games: paginatedGames,
            currentPage: page,
            totalPages: allPages,
            searchQuery: searchQuery
        });
    } catch (error) {
        console.error(error);
        res.send('Error fetching game list');
    }
});

app.get('/game/:id', async (req, res) => {
    const appId = req.params.id;
    const searchQuery = req.query.search || '';

    try {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
        const response = await axios.get(url);

        if (!response.data[appId] ?.success) {
            res.send('Error: Game details could not be retrieved (success is false).');
            return;
        }

        const data = response.data[appId] ?.data || {};

        const videos = (data.movies || []).map(movie => ({
            webm: movie.webm ? movie.webm[480] : null,
            mp4: movie.mp4 ? movie.mp4[480] : null
        })).filter(video => video.webm || video.mp4);

        res.render('details', {
            appid: appId,
            name: data.name || null,
            genre: data.genres ? data.genres.map(g => g.description).join(', ') : null,
            description: data.short_description || null,
            price: data.is_free ? 'Free' : (data.price_overview ?.final_formatted || null),
            release_date: data.release_date ?.date || null,
            platforms: data.platforms ? Object.keys(data.platforms).filter(p => data.platforms[p]) : null,
            publisher: data.publishers ? data.publishers.join(', ') : null,
            developer: data.developers ? data.developers.join(', ') : null,
            screenshots: data.screenshots ? data.screenshots.map(s => s.path_full) : null,
            videos: videos,
            searchQuery: searchQuery,
        });
    } catch (err) {
        console.error(err);
        res.send('Error fetching game details.');
    }
});













app.listen(port, () => console.log(`Server is running on port: ${port}`));