//hello dear, this is for front end home page and search page.
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const homeAndSearchController = require('../controllers/homeAndSearchController');
const savePostController = require('../controllers/savePostControllers');

router.get('/', verifyToken,  homeAndSearchController.getTopicPosts, savePostController.getParticularPost);

// router.get('/post', verifyToken)

module.exports = router;