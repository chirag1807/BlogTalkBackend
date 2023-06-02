const blogPostModel = require('../models/blogPostModel');

const getTopicPosts = (req, res, next) => {
    const getUserFavTopicPosts = async () => {
        const headers = req.headers;
        try{
            result = await blogPostModel.find({topic: parseInt(headers.id)}).sort({ publishedAt: -1 }).limit(10);
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

const getForYouPosts = (req, res, next) => {
    const getPostsForUser = async () => {
        try{
            let topics = JSON.parse(req.headers.topics);
            console.log(topics);
            result = await blogPostModel.aggregate([
                {$match: {topic: {$in: topics}}},
                { $sample: { size: 10 } },
                { $sort: { topic: 1 } },
            ]);

            result = result.map(obj => obj._id);
            console.log(result);
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
    getPostsForUser();
}

const searchPosts = (req, res, next) => {
    const getUserSearchPosts = async () => {
        const headers = req.headers;
        try{
            const searchCriteria = headers.id ? {
                $or: [
                  { title: { $regex: headers.id, $options: 'i' } },
                  { content: { $regex: headers.id, $options: 'i' } },
                ],
              } : {};

            result = await blogPostModel.find(searchCriteria).limit(10);
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
    getUserSearchPosts();
}

module.exports = {
    getTopicPosts,
    getForYouPosts,
    searchPosts,
}