const express = require('express');
const router = express.Router();
const userFollowersControllers = require('../controllers/userFollowersControllers');

router.route('/').get(userFollowersControllers.getFollowers);

router.route('/').post(userFollowersControllers.setFollowers);

router.route('/').patch(userFollowersControllers.updateFollowers);

router.route('/').delete(userFollowersControllers.deleteFollower);

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