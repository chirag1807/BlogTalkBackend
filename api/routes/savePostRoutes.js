const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const savePostController = require('../controllers/savePostControllers');

router.get('/', verifyToken, savePostController.getAllPosts, savePostController.getParticularPost);

router.post('/', verifyToken, savePostController.savePost);

router.delete('/', verifyToken, savePostController.deletePost);

module.exports = router;