const express = require('express');
const router = express.Router();
const song = require('../../models/song');

router.get('/songs', async (req, res) => {
    try {
        const songs = await song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/songs/findByGenre', async (req, res) => {
    try {
        const genres = req.body;
        //console.log("Genres:", genres);

        // const query = await song.find({ 
        //     "genre.electronic": genres.Electronic, 
        //     "genre.lofi": genres.LoFi, 
        //     "genre.ambient": genres.Ambient, 
        //     "genre.classical": genres.Classical 
        // });

        const genreQuery = {};

        Object.keys(genres).forEach(key => {
            if (genres[key]) {
                genreQuery[`genre.${key.toLowerCase()}`] = true;
            }
        });

        const query = await song.find(genreQuery);
        console.log(query);

        res.json({ success: true, songs: query });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
