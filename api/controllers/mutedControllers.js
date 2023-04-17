const mutedModel = require('../models/mutedModel');
const topicNameIdsModel = require('../models/topicNameIds');

const getMutedTopicWrites = (req, res) => {
    const getUserMutedTopicWrites = async () => {
        try {
            const result = await mutedModel.find({_id: req.query.id});

            res.status(200).json({
                msg: "Muted Topics Writers Fetched Successfully",
                result: result
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    getUserMutedTopicWrites();
}

const setMutedTopicWrites = (req, res) => {
    const setUserMutedTopicWrites = async () => {
        try {
            const writerCount = req.body.writerIds.length;
            const topicCounts = req.body.topicIds.length;
            const mutedTopicWriters = new mutedModel({
                _id: req.body.id,
                writerCount: writerCount,
                writerIds: req.body.writerIds,
                topicCounts: topicCounts,
                topicIds: req.body.topicIds
            })
            
            const result = await mutedTopicWriters.save();
            res.status(200).json({
                msg: "User Muted Topics Writers Setted Successfully"
            })
            console.log(result);
    
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    setUserMutedTopicWrites();
}

const updateMutedAddWriter = (req, res) => {
    const updateUserMutedAddWriter = async () => {
        try {
            const {id, writerId} = req.body;
            // const muted = await mutedModel.findOneAndUpdate({uid: uid}, {
            //     $push: {
            //         writerIds: writerId
            //     },
            //     $set: {
            //         writerCount: writerCount++ //give error as writerCount is not defined
            //     }
            // })
            const muted = await mutedModel.find({_id: id});
            muted[0].writerIds.push(writerId);
            muted[0].writerCount = muted[0].writerIds.length;
            muted[0].save();
            res.status(201).json({
                msg: "Writer Added Successfully in muted list"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }
    
    updateUserMutedAddWriter();
}

const updateMutedRemoveWriter = (req, res) => {
    const updateUserMutedRemoveWriter = async () => {
        try {
            const {id, writerId} = req.body;
            const muted = await mutedModel.find({_id: id});
            if(muted[0] == undefined){
                res.status(400).json({
                    msg: "Can't match uid with given uid"
                })
            }
            else{
                muted[0].writerIds.pull(writerId);
                muted[0].writerCount = muted[0].writerIds.length;
                muted[0].save();
                res.status(201).json({
                    msg: "Writer Deleted Successfully from muted list"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                msg: error
            })
        }
    }
    
    updateUserMutedRemoveWriter();
}

const updateMutedAddTopic = (req, res) => {
    const updateUserMutedAddTopic = async () => {
        try {
            const {id, topicName} = req.body;
            const result = await topicNameIdsModel.find({topicName: topicName});
            result[0].muted = result[0].muted + 1;
            await result[0].save();
            const topicId = result[0].topicId;
            const muted = await mutedModel.find({_id: id});
            muted[0].topicIds.push(topicId);
            muted[0].topicCounts = muted[0].topicIds.length;
            await muted[0].save();
            res.status(201).json({
                msg: "Topic Added Successfully in muted list"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }
    
    updateUserMutedAddTopic();
}

const updateMutedRemoveTopic = (req, res) => {
    const updateUserMutedRemoveTopic = async () => {
        try {
            const {id, topicName} = req.body;
            const result = await topicNameIdsModel.find({topicName: topicName});
            if(result[0].muted != 0){
                result[0].muted = result[0].muted - 1;
                await result[0].save();
            }
            const topicId = result[0].topicId;
            const muted = await mutedModel.find({_id: id});
            muted[0].topicIds.pull(topicId);
            muted[0].topicCounts = muted[0].topicIds.length;
            muted[0].save();
            res.status(201).json({
                msg: "Topic Deleted Successfully from muted list"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
        }
    }
    
    updateUserMutedRemoveTopic();
}

module.exports = {getMutedTopicWrites, setMutedTopicWrites, updateMutedAddWriter, updateMutedRemoveWriter, updateMutedAddTopic, updateMutedRemoveTopic};