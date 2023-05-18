const blogPostModel = require('../models/blogPostModel');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const verifyToken = require('../middlewares/verifyToken');

cloudinary.config({
    cloud_name: process.env.cloud_name, 
    api_key: 877259119788592, 
    api_secret: process.env.api_secret
  });

const getAllPosts = (req, res) => {
    const getUsersAllPost = async () => {
        const headers = req.headers;
        try{
            const result = await blogPostModel.find({author: headers.uid});
                if(result[0] == undefined){
                    res.status(204).json({
                        msg: "No Blog Post Available for this User"
                    })
                }
                else {
                    res.status(200).json({
                    result: result[0],
                    msg: "User's all Posts Fetched Successfully"
                })
            }
        } catch (error) {
            res.status(400).json({
                msg: "Can't fetch User Details"
            })
        }
    }

    getUsersAllPost();
}

const getParticularPosts = (req, res) => {
    const getUserParticularPost = async () => {
        try{
            const result = await blogPostModel.find({_id: req.headers.id});
            if(result[0] == undefined){
                res.status(401).json({
                    msg: "Invalid Token"
                })
            }
            else{
                res.status(200).json({
                    result: result[0],
                    msg: "Post Fetched Successfully"
                })
            }
        } catch (error) {
            res.status(400).json({
                msg: "Can't fetch User Details"
            })
        }
    }
    getUserParticularPost();
}

const uploadPost = (req, res) => {
    const uploadUserPost = async () => {
    
        const headers = req.headers;
        try{
            if(req.file){
                var locaFilePath = req.file.path;
    
                var dataAndUrl = await uploadToCloudinary(locaFilePath);
            }

            const contentWithoutLineBreaks = req.body.content.replace(/\n/g, ' ');

            const readTimeMinutes = contentWithoutLineBreaks.trim().split(/\s+/).length / 180;

            const post = new blogPostModel({
                title: req.body.title,
                content: req.body.content,
                topic: parseInt(req.body.topic),
                author: headers.uid,
                coverImage: req.file ? dataAndUrl.url : "",
                readMinute: Math.ceil(readTimeMinutes),
            });

            const result = await post.save();

            res.status(200).json({
                result: result,
                msg: "Blog Post Uploaded Successfully"
            });

        } catch(error) {
            res.status(400).json({
                msg: error
            })
        }
    }
    uploadUserPost();
}

async function uploadToCloudinary(locaFilePath) {
  
    var mainFolderName = "main";
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

    return cloudinary.uploader
        .upload(locaFilePath)
        .then((result) => {

            fs.unlinkSync(locaFilePath);
  
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

const updatePost = (req, res) => {

}

const updatePostLike = (req, res) => {
    const updateUserPostLike = async () => {
        const headers = req.headers;
        try{
            const result1 = await blogPostModel.find({_id: req.body.id});
            let update;
            if(result1[0].likes.includes(headers.uid)){
                update = {
                    $pull: {
                        likes: headers.uid
                    },
                    $inc: {
                        noOfLikes: -1
                    }
                }
            }
            else{
                update = {
                    $addToSet: {
                        likes: headers.uid
                    },
                    $inc: {
                        noOfLikes: 1
                    }
                }
            }

            const result = await blogPostModel.findOneAndUpdate({_id: req.body.id}, update, {upsert: true});

            // const result = await blogPostModel.findOneAndUpdate({_id: req.body.id}, {
            //     $pull: {
            //         likes: headers.uid
            //     },
            //     $inc: {
            //         noOfLikes: -1
            //     }
            // });

            res.status(200).json({
                result: result,
                msg: "Like Added to Post"
            })
        } catch (error) {
            res.status(400).json({
                msg: "Can't Remove Like from Post"
            })
        }
    }
    updateUserPostLike();
}

const updatePostIncrView = (req, res) => {
    const incrementPostView = async () => {
        const headers = req.headers;
        try{
            const update = {
              $addToSet: { views: headers.uid },
              $inc: { noOfViews: 1 }
            };
            const options = { upsert: true };
            const query = { views: { $ne: headers.uid } };
            const result = await blogPostModel.findOneAndUpdate({_id: req.body.id}, query, update, options);

            res.status(200).json({
                // result: result,
                msg: "View Added to Post"
            })
        } catch (error) {
            res.status(400).json({
                msg: "Can't Add View to Post"
            })
        }
    }
    incrementPostView();
}

const deletePost = (req, res) => {
    const deleteUserPost = async () => {
        try{
            const result = await blogPostModel.deleteOne({_id: req.body.id});
            res.status(200).json({
                // result: result[0],
                msg: "Post Deleted Successfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: "Can't fetch User Details"
            })
        }
    }
    deleteUserPost();
}

module.exports = {getAllPosts, getParticularPosts, uploadPost,
    updatePost, updatePostLike, updatePostIncrView, deletePost};