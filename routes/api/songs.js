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

module.exports = router;
