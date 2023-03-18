const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const favTopicsModel = require('../models/favTopicsModel');

router.get('/', (req, res) => {
    const getFavTopics = async () => {
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

    getFavTopics();
});

router.post('/', (req, res) => {
    const {uid, favTopics} = req.body;
    const setFavTopics = async () => {
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
    
    setFavTopics();
});

router.patch('/', async (req, res) => {
    const updateFavTopics = async () => {
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

    updateFavTopics();
});

module.exports = router;


// router.patch('/', async (req, res) => {
//     const updateFavTopics = async () => {
//         try{
//             const updatedFavTopics = await favTopicsModel.findOneAndUpdate(
//                 {uid: req.body.uid},
//                 // { $push: { favTopics: req.body.favTopics } },
//                 //push will simply add data to list with same values(it will allow same data to store in the list).
//                 { $addToSet: { favTopics: req.body.favTopics } },
//                 {new: true, upsert: true,}
//                 //here upsert: true will create user if it doesn't exist.
//             );
//             res.status(201).json({
//                 msg: "Favorite Topics Updated Successfully"
//             })
//             console.log("Favorite Topics Updated Successfully");
//         } catch(error) {
//             res.status(400).json({
//                 msg: error
//             })
//             console.log(error);
//         }
//     }

//     updateFavTopics();
// });