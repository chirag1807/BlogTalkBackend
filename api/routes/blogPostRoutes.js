const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const blogPostModel = require('../models/blogPostModel');

router.get('/', (req, res) => {
    res.status(200).send("blogPostRoute");
})

module.exports = router;