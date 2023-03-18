const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mutedModel = require('../models/mutedModel');

router.get('/', (req, res) => {
    res.status(200).send("mutedRoute");
})

module.exports = router;