const express = require('express');
const router = express.Router();
const DJ = require('../../models/dj');

router.get('/djs', async (req, res) => {
    try {
        const djs = await DJ.find();
        res.json(djs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add song to dj
router.post('/djs/:djID/addsong', async (req, res) => {
    try {
        const djID = req.params.djID;
        const { songID } = req.body;
        const dj = await DJ.findOne({ djID: djID });
        if (!dj.songs.includes(songID)) {
            dj.songs.push(songID);
            await dj.save();
            res.json({ success: true, updatedDJ: dj });
        } else {
            res.json({ success: false, message: "Song already in playlist" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete song from dj
router.delete('/djs/:djID/deletesong', async (req, res) => {
    try {
        const djID = req.params.djID;
        const { songID } = req.body;
        const dj = await DJ.findOne({ djID: djID });
        dj.songs = dj.songs.filter(id => id !== songID);
        await dj.save();
        res.json({ success: true, updatedDJ: dj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all events
router.get('/events', async (req, res) => {
    try {
        const djs = await DJ.find();
        let events = [];

        djs.forEach(dj => {
            events = events.concat(dj.events);
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add an event to a DJ
router.post('/djs/:djID/addevent', async (req, res) => {
    try {
        const djID = req.params.djID;
        const { time, songs } = req.body;
        const dj = await DJ.findOne({ djID: djID });
        
        const newEvent = {
            dj: dj.name,  // Assuming you want to store the DJ's name in the event
            time: time,
            songs: songs
        };

        dj.events.push(newEvent);
        await dj.save();
        res.json({ success: true, message: 'Event added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
