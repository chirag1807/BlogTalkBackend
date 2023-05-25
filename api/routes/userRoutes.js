const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const userControllers = require('../controllers/userControllers');
const multer = require("multer");
const fs = require("fs");

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


router.get('/', verifyToken, userControllers.getUser);

router.route('/login').post(userControllers.loginUser);

router.route('/reset-token').post(userControllers.resetToken);

router.route('/forgot-password').post(userControllers.forgotPasswordSendEmail);

router.route('/verify-code').post(userControllers.forgotPasswordVerifyCode);

router.post('/', upload.single("image"), userControllers.postUser);

router.patch('/', verifyToken, userControllers.updateNameBio);

router.patch('/emailPass', verifyToken, userControllers.updateEmailPass);

module.exports = router;


//using multer-storage-cloudinary dependency

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//     cloud_name: process.env.cloud_name, 
//     api_key: process.env.api_key, 
//     api_secret: process.env.api_secret
//   });

//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "USERPROFILEPICS",
//     },
//   });
  
//   const upload = multer({ storage: storage });