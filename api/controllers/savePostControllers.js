const savePostModel = require('../models/savePostModel');
const blogPostModel = require('../models/blogPostModel');
const userModel = require('../models/userModel');

const getAllPosts = (req, res, next) => {
    const getAllSavedPosts = async () => {
        const headers = req.headers;
        try{
            result = await savePostModel.find({uid: headers.uid});
            result = result.map(obj => obj._id);
            if(result.length > 0){
                req.headers.ids = result;
                next();
            }
            else{
                res.status(204).json({
                    msg: "You Don't have any saved posts"
                })
            }
        } catch(error) {
            console.log(error);
            res.status(400).json({
                msg: error
            })
        }
    }
    getAllSavedPosts();
}

const getParticularPost = (req, res) => {
    const getParticularBlogPost = async () => {

        const blogs = [];

        for(const id of req.headers.ids){

            let result = await findBlog(id);

            let result1 = await userModel.find({_id: result[0].author.id}).populate('followers');
            let followingOrNot = result1[0].followers.followersUid.some((obj) => obj.followerUid === req.headers.uid);
            followingOrNot = followingOrNot ? 1 : 0;

            const modifiedResult = result.map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    topic: item.topic,
                    image: item.coverImage,
                    publishedAt: item.publishedAt,
                    readMinute: item.readMinute,
                    followingOrNot: followingOrNot,
                    author: item.author,
                    createdByYou: item.author == req.headers.uid ? 1 : 0
                }
            })
            
            blogs.push(modifiedResult[0]);
        }

        res.status(200).json({
            result: blogs
        })
    }
    
    getParticularBlogPost();
}

const findBlog = (id) => {
    return blogPostModel.find({_id: id}).populate('author');
}

const savePost = (req, res) => {
    const saveUsersPost = async () => {
        const headers = req.headers;
        try{
            const post = new savePostModel({
                _id: req.body.blogId,
                uid: headers.uid
            })

            post.save();

            res.status(200).json({
                msg: "Post Saved Successfully"
            });

        } catch(e) {
            res.status(400).json({
                msg: error
            })
        }
    }
    saveUsersPost();
}

const deletePost = (req, res) => {
    const deletePostFromSave = async () => {
        try{
            await savePostModel.deleteOne({_id: req.body.blogId});
            res.status(200).json({
                msg: "Post Deleted From Save Successfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: "Can't Delete Post From Save"
            })
        }
    }
    deletePostFromSave();
}

module.exports = {getAllPosts, getParticularPost, savePost, deletePost}