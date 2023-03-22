const userFollowingModel = require('../models/userFollowingModel');

const getFollowings = (req, res) => {
    const getUserFollowings = async () => {
        try {
            const result = await userFollowingModel.find({uid: req.query.uid});

            res.status(200).json({
                msg: "User Followings Fetched Successfully",
                result: result
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
                uid: req.body.uid,
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
            const user = await userFollowingModel.find({uid: req.body.uid})
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
            console.log(req.body.uid);
            
            const user = await userFollowingModel.findOneAndUpdate({uid: req.body.uid},
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