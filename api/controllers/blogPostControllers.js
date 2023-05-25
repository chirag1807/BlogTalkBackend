const blogPostModel = require('../models/blogPostModel');
const userModel = require('../models/userModel');
const savePostModel = require('../models/savePostModel');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const jwt = require('jsonwebtoken');
const secret_key_Access_Token = process.env.secret_key_Access_Token;

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
                if(result == undefined){
                    res.status(204).json({
                        msg: "No Blog Post Available for this User"
                    })
                }
                else {
                    // const modifiedResult = result.map((document) => {
                    //     const modifiedDocument = JSON.parse(JSON.stringify(document));

                    //     if(modifiedDocument.likes.includes(headers.uid)){
                    //         modifiedDocument.likedOrNot = 1;
                    //     }
                    //     else{
                    //         modifiedDocument.likedOrNot = 0;
                    //     }

                    //     return modifiedDocument;
                    // })

                    const modifiedResult = result.map(item => {
                        return {
                            id: item._id,
                            title: item.title,
                            topic: item.topic,
                            image: item.coverImage,
                            publishedAt: item.publishedAt,
                            readMinute: item.readMinute
                        }
                    })

                    res.status(200).json({
                    result: modifiedResult,
                    msg: "User's all Posts Fetched Successfully"
                })
            }
        } catch (error) {
            console.log(error);
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
            var result = await blogPostModel.find({_id: req.headers.id}).populate('author');
            if(result[0] == undefined){
                res.status(401).json({
                    msg: "Invalid Token"
                })
            }
            else{
                const accessToken = req.headers.authorization.split(" ")[1];
                const result1 = jwt.verify(accessToken, secret_key_Access_Token);
                if(result1 != null){
                    const modifiedResult = JSON.parse(JSON.stringify(result[0]));
                    if(modifiedResult.likes.includes(result1.uid)){
                        modifiedResult.likedOrNot = 1;
                    }
                    else{
                        modifiedResult.likedOrNot = 0;
                    }
                    // if(modifiedResult.views.includes(result1.uid)){
                    //     modifiedResult.viewedOrNot = 1;
                    // }
                    // else{
                    //     modifiedResult.viewedOrNot = 0;
                    // }
                    result = await userModel.find({_id: result[0].author.id}).populate('followers');
                    let followingOrNot = result[0].followers.followersUid.some((obj) => obj.followerUid === result1.uid);
                    modifiedResult.followingOrNot = followingOrNot ? 1 : 0;

                    result = await savePostModel.find({uid: result1.uid});
                    let savedOrNot = result.some((obj) => obj._id === req.headers.id);
                    modifiedResult.savedOrNot = savedOrNot ? 1 : 0;

                    res.status(200).json({
                        result: modifiedResult,
                        msg: "Post Fetched Successfully"
                    })
                }
                else{
                    return res.status(401).json({
                        msg:"Token is invalid"
                    })
                }
            }
        } catch (error) {
            console.log(error);
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

const updatePost = (req, res) => {
    const updateUserPost = async () => {
        try{
            if(req.file){
                var locaFilePath = req.file.path;
    
                var dataAndUrl = await uploadToCloudinary(locaFilePath);
            }

            const blog = await blogPostModel.find({_id: req.body.id});

            if(dataAndUrl == undefined){
                if(blog[0].coverImage != ""){
                    dataAndUrl = blog[0].coverImage;
                }
                else{
                    dataAndUrl = "";
                }
            }

            if(blog[0].title != req.body.title){
                console.log("1");
                blog[0].title = req.body.title;
            }
            if(blog[0].content != req.body.content){
                console.log("2");
                blog[0].content = req.body.content;
                const contentWithoutLineBreaks = req.body.content.replace(/\n/g, ' ');

                const readTimeMinutes = contentWithoutLineBreaks.trim().split(/\s+/).length / 180;
                blog[0].readMinute = Math.ceil(readTimeMinutes);
            }
            if(blog[0].topic != req.body.topic){
                console.log("3");
                blog[0].topic = req.body.topic;
            }
            if(blog[0].coverImage != dataAndUrl){
                console.log("4");
                blog[0].coverImage = dataAndUrl;
            }

            await blog[0].save();
            

            res.status(200).json({
                msg: "Blog Post Updated Successfully"
            })
        }
        catch(e){
            res.status(400).json({
                msg: error
            })
        }
    }
    updateUserPost();
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
            const result = await blogPostModel.findOneAndUpdate({ _id: req.body.id, views: { $ne: headers.uid } },
                { $push: { views: headers.uid }, $inc: { noOfViews: 1 } },
                { new: true });

            if(result){
                res.status(200).json({
                    msg: "View Added to Post"
                })
            }    
            else{
                res.status(200).json({
                    msg: "View Could not be Added"
                })
            }
        } catch (error) {
            console.log(error);
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