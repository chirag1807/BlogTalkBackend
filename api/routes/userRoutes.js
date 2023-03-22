const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const verifyToken = require('../middlewares/verifyToken');
const bcrypt = require('bcryptjs');
const userControllers = require('../controllers/userControllers');
const mongoose = require('mongoose');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
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

cloudinary.config({
    cloud_name: process.env.cloud_name, 
    api_key: 877259119788592, 
    api_secret: process.env.api_secret
  });


router.get('/', verifyToken, userControllers.getUser);

router.route('/login').post(userControllers.loginUser);

router.route('/reset-token').post(userControllers.resetToken);

router.route('/forgot-password').post(userControllers.forgotPasswordSendEmail);

router.route('/verify-code').post(userControllers.forgotPasswordVerifyCode);

router.post('/', upload.single("image"), (req, res) => {
    const createUser = async () => {
        try {
            if(req.file){

            var locaFilePath = req.file.path;

            var dataAndUrl = await uploadToCloudinary(locaFilePath);
            console.log(dataAndUrl);
            
            }

            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err){
                    return res.status(500).json({
                        msg: err
                    })
                }
                else{
                    const user = new userModel({
                        name: req.body.name,
                        bio: req.body.bio,
                        emailId: req.body.emailId,
                        password: hash,
                        image: req.file ? dataAndUrl.url : "",
                    })
                    const result = await user.save();
        
                    const addUid = await userModel.findOneAndUpdate({_id: result._id},
                        {
                            $set: {'uid': result._id}
                        }    
                    )

                    const accessToken = userControllers.generateAccessToken(result._id);
                    const refreshToken = userControllers.generateRefreshToken(result._id);
                    console.log(accessToken);
                    console.log(refreshToken);
                    
                    res.status(200).json({
                        result: result,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        msg: "User Created Successfully"
                    })
                }
            })

        }
        catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }

    createUser();
});



async function uploadToCloudinary(locaFilePath) {
  
    var mainFolderName = "main";
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

    return cloudinary.uploader
        .upload(locaFilePath)
        .then((result) => {

            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
  
            console.log(error);
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

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