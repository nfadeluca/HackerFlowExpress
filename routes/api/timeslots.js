const express = require('express');
const router = express.Router();
const timeslot = require('../../models/timeslot');

router.get('/timeslots', async (req, res) => {
    try {
        const timeslots = await timeslot.find();
        res.json(timeslots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
