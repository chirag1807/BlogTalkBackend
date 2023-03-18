const { query } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userFollowersModel = require('../models/userFollowersModel');

router.get('/', (req, res, next) => {
    const getUserFollowers = async () => {
        try {
            const result = await userFollowersModel.find({uid: req.query.uid});

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
});

router.post('/', (req, res) => {
    const setUserFollowers = async () => {
        try {
            const userFollowers = new userFollowersModel({
                uid: req.body.uid,
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
});

router.patch('/', (req, res) => {
    const updateUserFollowers = async () => {
        try{
            const user = await userFollowersModel.find({uid: req.body.uid})
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
});


router.delete('/', (req, res) => {
    const deleteUserFollower = async () => {
        try {
            console.log(req.body.uid);
            
            const user = await userFollowersModel.findOneAndUpdate({uid: req.body.uid},
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
})

module.exports = router;



            // const abc = await userFollowersModel.find(
            //     {uid: req.body.uid,}
            //     )

            //     console.log(abc[0].followersUid);
            //     const a = abc[0].followersUid;
            //     let isFound = a.find((key) => {
            //         return req.body.followersUid.followerUid.toString() == key.followerUid.toString()
            //     })

            //     if(isFound){
            //         a.forEach((ele, index) => {
            //             if(req.body.followersUid.followerUid.toString() == ele.followerUid.toString()){
            //                 ele.isFollowing = req.body.followersUid.isFollowing;
            //             }
            //         })
            //     }
            //     else{
            //         a.push(req.body.followersUid);
            //     }

            //     await abc[0].save();

            

                // "$cond": {
                //     "if": {
                //         "$eq": [
                //             'followersUid.followerUid', req.body.followersUid.followerUid
                //         ]
                //     },
                //     "then": {
                //         "$set": [
                //             'followersUid',
                //             req.body.followersUid
                //         ]
                //     }
                // }



                // const updatedUserFollowers = await userFollowersModel.findOneAndUpdate(
                //     {uid: req.body.uid, },
                //     { 
                //         $cond: [ { $eq: [ "followersUid.followerUid", req.body.followersUid.followerUid ] },
                //                         {$set: ['followersUid', req.body.followersUid]},
                //                         {$addToSet: ['followersUid', req.body.followersUid]} 
                //                ]
                //     },
                //     {new: true, upsert: true,}
                // ).then((data) => {
                //     console.log(data);
                // });


                // const updatedUserFollowers = await userFollowersModel.findOneAndUpdate(
                //     {uid: req.body.uid, 'followersUid.followerUid': {$eq: req.body.followersUid.followerUid}},
                //     { $set: { 'followersUid': req.body.followersUid } },
                //     {new: true, upsert: true,}
                // );