const userFollowingModel = require('../models/userFollowingModel');
const userModel = require('../models/userModel');

const getFollowings = (req, res) => {
    const getUserFollowings = async () => {
        try {
            const result = await userFollowingModel.find({_id: req.headers.followingId});

            const followingsList = [];

            for(const id of result[0].followingsUid){
                const result1 = await userModel.find({_id: id.followingUid});
                if(result1[0] != undefined){
                    followingsList.push({
                        followingUid: id.followingUid,
                        isFollowingBack: id.isFollowingBack == true ? 1 : 0,
                        user: result1[0]
                    })
                }
            }

            res.status(200).json({
                msg: "User Followings Fetched Successfully",
                result: followingsList
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    getUserFollowings();
}

const setFollowings = (req, res) => {
    const setUserFollowings = async () => {
        try {
            const userFollowings = new userFollowingModel({
                _id: req.body.id,
                followingCount: req.body.followingCount,
                followingsUid: req.body.followingsUid,
            })
            
            const result = await userFollowings.save();
            res.status(200).json({
                result: result,
                msg: "User Followings Setted Successfully"
            })
            console.log(result);
    
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    setUserFollowings();
}

const updateFollowings = (req, res) => {
    const updateUserFollowings = async () => {
        try{
            const user = await userFollowingModel.find({_id: req.body.id})
            let indicator = 0;
            for (let i = 0; i < user[0].followingsUid.length; i++) {
                if(user[0].followingsUid[i].followingUid == req.body.followingsUid.followingUid){
                    indicator = 1;
                    user[0].followingsUid[i].isFollowingBack = req.body.followingsUid.isFollowingBack;
                    user[0].save();
                    break;
                }
            }
            if(indicator == 0){
                user[0].followingCount++;
                user[0].followingsUid.push(req.body.followingsUid);
                user[0].save();
            }

            res.status(201).json({
                result: user[0],
                msg: "Favorite Topics Updated Successfully"
            })
            console.log("Favorite Topics Updated Successfully");
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }

    updateUserFollowings();
}

const deleteFollowings = (req, res) => {
    const deleteUserFollowing = async () => {
        try {
            console.log(req.body.id);
            
            const user = await userFollowingModel.findOneAndUpdate({_id: req.body.id},
                {
                    $pull: {
                        "followingsUid": {
                            "followingUid": req.body.followingsUid.followingUid,
                        }
                    },
                    $inc: {
                        "followingCount": -1
                    }
                }
            );

            res.status(201).json({
                msg: "User Follower Deleted Successfully"
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }

    }
    deleteUserFollowing();
}

module.exports = {getFollowings, setFollowings, updateFollowings, deleteFollowings};