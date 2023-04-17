//used by admin
const topicNameIdsModel = require('../models/topicNameIds');

const getTopicNameId = (req, res) => {
    const getTopicNameIdFunc = async () => {
        try {
            const result = await topicNameIdsModel.find({topicId: req.query.topicId});
            res.status(200).json({
                msg: "Topic Name Id Fetched Successfully",
                result: result
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    getTopicNameIdFunc();
}

const getAllTopicNameIds = (req, res) => {
    const getAllTopicNameIdsFunc = async () => {
        try {
            const result = await topicNameIdsModel.find();

            res.status(200).json({
                msg: "TopicNameIds Fetched Successfully",
                result: result
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    getAllTopicNameIdsFunc();
}

const setTopicNameId = (req, res) => {
    const setTopicNameIdFunc = async () => {
        try {
            const topic = await topicNameIdsModel.findOne().sort({_id: -1});
            let topicId = 1;
            if(topic != null){
                topicId = topic.topicId + 1;
            }
            const result = new topicNameIdsModel({
                topicId: topicId,
                topicName: req.body.topicName,
            });

            await result.save();

            res.status(200).json({
                msg: "Topic Name Id Setted Successfully",
                result: result
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }

    setTopicNameIdFunc();
}

const updateTopicName = (req, res) => {
    const updateTopicNameFunc = async () => {
        try {
            const topic = await topicNameIdsModel.find({topicId: req.body.topicId});
            topic[0].topicName = req.body.topicName;
            await topic[0].save();

            res.status(201).json({
                result: topic[0],
                msg: "Update done successfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }

    updateTopicNameFunc();
}

const deleteTopic = (req, res) => {
    const deleteTopicFunc = async () => {
        try {
            const topic = await topicNameIdsModel.findOneAndRemove({topicId: req.body.topicId});
            const abc = await topicNameIdsModel.find({topicId: {$gt: topic.topicId}});
            if(abc.length != 0){
                for(let i=0; i<abc.length; i++){
                    console.log(abc[i].topicId);
                    abc[i].topicId = abc[i].topicId - 1;
                    console.log(abc[i].topicId);
                    abc[i].save();
                }
            }
            res.status(201).json({
                result: topic,
                msg: "Delete done successfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }

    deleteTopicFunc();
}

module.exports = {getTopicNameId, getAllTopicNameIds, setTopicNameId, updateTopicName, deleteTopic};