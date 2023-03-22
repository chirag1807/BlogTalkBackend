const favTopicsModel = require('../models/favTopicsModel');

const getFavTopics = (req, res) => {
    const getUserFavTopics = async () => {
        const {uid} = req.query;
        try {
            const result = await favTopicsModel.find({uid: uid});
            res.status(200).json({
                result: result,
                msg: "FavTopics Fetched Successfully"
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }

    getUserFavTopics();
}


const setFavTopics = (req, res) => {
    const {uid, favTopics} = req.body;
    const setUserFavTopics = async () => {
        try {
            const favTopicsResult = new favTopicsModel({
                uid: uid,
                favTopicsCount: favTopics.length,
                favTopics: favTopics
            })
            
            const result = await favTopicsResult.save();
            res.status(200).json({
                result: result,
                msg: "favTopics Setted Successfully"
            })
            console.log(result);
    
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    setUserFavTopics();
}


const updateFavTopics = (req, res) => {
    const updateUserFavTopics = async () => {
        const {uid, favTopics} = req.body;
        try {
            const user = await favTopicsModel.findOneAndUpdate({uid: uid}, {
                $set: {
                    favTopics: favTopics,
                    favTopicsCount: favTopics.length
                },
            })
            res.status(200).json({
                result: user,
                msg: "FavTopics Updated Succesfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }

    updateUserFavTopics();
}

module.exports = {getFavTopics, setFavTopics, updateFavTopics};