const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const userFollowingModel = require('../models/userFollowingModel');
const userFollowersModel = require('../models/userFollowersModel');
const router = express.Router();

router.patch('/', verifyToken, async (req, res) => {
    try {
        const headers = req.headers;
        if(req.body.indicator == 0){
            //0 means add to followings, 1 means remove from followings
            let user = await userFollowingModel.find({_id: headers.followingId});
            let user1 = await userFollowingModel.find({_id: req.body.followingId});
            let user2 = await userFollowersModel.find({_id: req.body.followerId});
            let indicator = 0;
            for (let i = 0; i < user1[0].followingsUid.length; i++) {
                if(user1[0].followingsUid[i].followingUid == headers.uid){
                    indicator = 1;
                    break;
                }
            }
            if(indicator == 0){
                user[0].followingCount++;
                let followingObject = {
                    "followingUid": req.body.uid,
                    "isFollowingBack": false
                }
                user[0].followingsUid.push(followingObject);
                await user[0].save();

                console.log("1");
                user2[0].followerCount++;
                console.log(user2[0].followerCount);
                let followerObject = {
                    "followerUid": headers.uid,
                    "isFollowingBack": false
                }
                console.log("2");
                user2[0].followersUid.push(followerObject);
                await user2[0].save();
            }
            else{
                user[0].followingCount++;
                let followingObject = {
                    "followingUid": req.body.uid,
                    "isFollowingBack": true
                }
                user[0].followingsUid.push(followingObject);
                await user[0].save();

                user2[0].followerCount++;
                let followerObject = {
                    "followerUid": headers.uid,
                    "isFollowingBack": true
                }
                user2[0].followersUid.push(followerObject);
                await user2[0].save();
            }
        }
        else{
            await userFollowingModel.findOneAndUpdate({_id: headers.uid},
                {
                    $pull: {
                        "followingsUid": {
                            "followingUid": req.body.uid,
                        }
                    },
                    $inc: {
                        "followingCount": -1
                    }
                }
            );

            await userFollowersModel.findOneAndUpdate({_id: req.body.followerId},
                {
                    $pull: {
                        "followersUid": {
                            "followerUid": headers.uid,
                        }
                    },
                    $inc: {
                        "followerCount": -1
                    }
                }
            );
        }
        res.status(200).json({
            msg: "follower followings updated successfully"
        })
    } catch(e) {
        console.log(e);
        res.status(400).json({
            msg: "Something went wrong, please try again later"
        });
    }
});

module.exports = router;