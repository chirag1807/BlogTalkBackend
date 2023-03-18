const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require('dotenv');

cloudinary.config({
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "USERPROFILEPICS",
    },
  });
  
  const upload = multer({ storage: storage });

  




router.get('/', (req, res) => {
    res.status(200).send("userRoute");
})

router.post('/', upload.single("image"), (req, res) => {
    const createUser = async () => {
        try {
            console.log(req.file.path);

            // const user = new userModel({
            //     name: req.body.name,
            //     bio: req.body.bio,
            //     emailId: req.body.emailId,
            //     password: req.body.password,
            //     image: req.body.image,
            // })
            
            // const result = await user.save();

            res.status(200).json({
                msg: "User Created Successfully"
            })
            // console.log(result);
    
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    createUser();
});

module.exports = router;









// const fs = require("fs");
  
// // Creating uploads folder if not already present
// // In "uploads" folder we will temporarily upload
// // image before uploading to cloudinary
// if (!fs.existsSync("./uploads")) {
//     fs.mkdirSync("./uploads");
// }
  
// // Multer setup
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
  
// var upload = multer({ storage: storage });



// async function uploadToCloudinary(locaFilePath) {
  
//     // locaFilePath: path of image which was just
//     // uploaded to "uploads" folder
  
//     var mainFolderName = "main";
//     // filePathOnCloudinary: path of image we want
//     // to set when it is uploaded to cloudinary
//     var filePathOnCloudinary = 
//         mainFolderName + "/" + locaFilePath;
  
//     return cloudinary.uploader
//         .upload(locaFilePath, { public_id: filePathOnCloudinary })
//         .then((result) => {
  
//             // Image has been successfully uploaded on
//             // cloudinary So we dont need local image 
//             // file anymore
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
  
//             return {
//                 message: "Success",
//                 url: result.url,
//             };
//         })
//         .catch((error) => {
  
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
//             return { message: "Fail" };
//         });
// }