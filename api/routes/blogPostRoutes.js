const express = require('express');
const router = express.Router();
const blogPostModel = require('../models/blogPostModel');
const blogPostControllers = require('../controllers/blogPostControllers');
const multer = require("multer");
const fs = require("fs");
const verifyToken = require('../middlewares/verifyToken');

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
var upload = multer({ storage: storage });


router.get('/', verifyToken, blogPostControllers.getAllPosts);

router.get('/particular', blogPostControllers.getParticularPosts);

router.post('/', upload.single("image"), verifyToken, blogPostControllers.uploadPost);

router.patch('/', upload.single("image"), verifyToken, blogPostControllers.updatePost);

router.patch('/updateLike', verifyToken, blogPostControllers.updatePostLike);

router.patch('incrView', verifyToken, blogPostControllers.updatePostIncrView);

router.delete('/', verifyToken, blogPostControllers.deletePost);

module.exports = router;