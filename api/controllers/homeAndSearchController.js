const userModel = require('../models/userModel');
const userFollowingModel = require('../models/userFollowingModel');
const userFollowersModel = require('../models/userFollowersModel');
const favTopicsModel = require('../models/favTopicsModel');
const blogPostModel = require('../models/blogPostModel');

const getTopicPosts = (req, res, next) => {
    const getUserFavTopicPosts = async () => {
        const headers = req.headers;
        try{
            result = await blogPostModel.find({topic: parseInt(headers.id)}).sort({ publishedAt: -1 });
            result = result.map(obj => obj._id);
            if(result.length > 0){
                req.headers.ids = result;
                next();
            }
            else{
                res.status(204).json({
                    msg: "Nothing to Show Here"
                })
            }
        }catch(error){
            console.log(error);
            res.status(400).json({
                msg: error
            })
        }
    }
    getUserFavTopicPosts();
}

const getForYouPosts = (req, res) => {
    const getPostsForUser = async () => {
        const headers = req.headers;
    }
    getPostsForUser();
}

module.exports = {
    getTopicPosts,
    getForYouPosts
}