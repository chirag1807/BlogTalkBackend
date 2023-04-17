const userFollowersModel = require('../models/userFollowersModel');

const getFollowers = (req, res) => {
    const getUserFollowers = async () => {
        try {
            const result = await userFollowersModel.find({_id: req.query.id});

            res.status(200).json({
                msg: "User Followers Fetched Successfully",
                result: result
            });
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    getUserFollowers();
}

const setFollowers = (req, res) => {
    const setUserFollowers = async () => {
        try {
            const userFollowers = new userFollowersModel({
                _id: req.body.id,
                followerCount: req.body.followerCount,
                followersUid: req.body.followersUid,
            })
            
            const result = await userFollowers.save();
            res.status(200).json({
                msg: "User Followers Setted Successfully"
            })
            console.log(result);
    
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }
    }
    
    setUserFollowers();
}

const updateFollowers = (req, res) => {
    const updateUserFollowers = async () => {
        try{
            const user = await userFollowersModel.find({_id: req.body.id})
            let indicator = 0;
            for (let i = 0; i < user[0].followersUid.length; i++) {
                if(user[0].followersUid[i].followerUid == req.body.followersUid.followerUid){
                    indicator = 1;
                    user[0].followersUid[i].isFollowing = req.body.followersUid.isFollowing;
                    user[0].save();
                    break;
                }
            }
            if(indicator == 0){
                user[0].followerCount++;
                user[0].followersUid.push(req.body.followersUid);
                user[0].save();
            }

            res.status(201).json({
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

    updateUserFollowers();
}

const deleteFollower = (req, res) => {
    const deleteUserFollower = async () => {
        try {
            console.log(req.body.id);
            
            const user = await userFollowersModel.findOneAndUpdate({_id: req.body.id},
                {
                    $pull: {
                        "followersUid": {
                            "followerUid": req.body.followersUid.followerUid,
                        }
                    },
                    $inc: {
                        "followerCount": -1
                    }
                }
            );

            res.status(201).json({
                msg: "User Follower Deleted Successfully",
                result: user
            })
        } catch (error) {
            res.status(400).json({
                msg: error
            })
            console.log(error);
        }

    }
    deleteUserFollower();
}

module.exports = {getFollowers, setFollowers, updateFollowers, deleteFollower};