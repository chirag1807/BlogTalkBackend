const favTopicsModel = require('../models/favTopicsModel');
const topicNameIdsModel = require('../models/topicNameIds');

const getFavTopics = (req, res) => {
    const getUserFavTopics = async () => {
        const headers = req.headers;
        try {
            const result = await favTopicsModel.find({_id: headers.favTopicsId});
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
    const setUserFavTopics = async () => {
        try {
            const favTopics = req.body.favTopics;
            const headers = req.headers;
            for(let i=0; i< favTopics.length; i++){
                console.log(favTopics[i]);
                const result = await topicNameIdsModel.find({topicName: favTopics[i]});
                result[0].followed = result[0].followed + 1;
                await result[0].save();
                const topicId = result[0].topicId;
                favTopics[i] = topicId;
            }

            const favTopicsResult = new favTopicsModel({
                _id: headers.favTopicsId,
                favTopicsCount: favTopics.length,
                favTopics: favTopics
            })
            const result1 = await favTopicsResult.save();
            res.status(200).json({
                result: result1,
                msg: "favTopics Setted Successfully"
            })
    
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
        const headers = req.headers;
        const favTopics = req.body.favTopics;
        try {

            const result1 = await favTopicsModel.find({_id: headers.favTopicsId});

            for(let i=0; i< favTopics.length; i++){
                const result = await topicNameIdsModel.find({topicName: favTopics[i]});
                const topicId = result[0].topicId;
                favTopics[i] = topicId;
                if(!(result1[0].favTopics.includes(favTopics[i]))){
                    result[0].followed = result[0].followed + 1;
                    await result[0].save();
                }
            }

            const user = await favTopicsModel.findOneAndUpdate({_id: headers.favTopicsId}, {
                $set: {
                    favTopics: favTopics,
                    favTopicsCount: favTopics.length
                },
            }, {new: true})
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

const updateAddOneFavTopic = (req, res) => {
    const updateUserAddOneFavTopic = async () => {
        let {id, favTopic} = req.body;
        try {

            const result = await topicNameIdsModel.find({topicName: favTopic});
            result[0].followed = result[0].followed + 1;
            await result[0].save();
            favTopic = result[0].topicId;

            const user = await favTopicsModel.findOneAndUpdate({_id: id}, {
                $addToSet: {
                    "favTopics" : favTopic
                },
                $inc: {
                    "favTopicsCount": 1
                },
            }, {new: true})
            // .sort({favTopics: 1})
            ;

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

    updateUserAddOneFavTopic();
}

const deleteOneFavTopic = (req, res) => {
    const deleteOneFavTopic = async () => {
        let {id, favTopic} = req.body;
        try {

            const result = await topicNameIdsModel.find({topicName: favTopic});
            if(result[0].followed != 0){
                result[0].followed = result[0].followed - 1;
                await result[0].save();
            }
            favTopic = result[0].topicId;

            const user = await favTopicsModel.findOneAndUpdate({_id: id}, {
                $pull: {
                    "favTopics" : favTopic
                },
                
                $inc: {
                    "favTopicsCount": -1
                },
            }, {new: true});

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

    deleteOneFavTopic();
}

module.exports = {getFavTopics, setFavTopics, updateFavTopics, updateAddOneFavTopic, deleteOneFavTopic};