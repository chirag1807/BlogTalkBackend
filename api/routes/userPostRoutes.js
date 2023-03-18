const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userPostModel = require('../models/userPostModel');

router.get('/', (req, res) => {
    res.status(200).send("userPostRoute");
})

module.exports = router;