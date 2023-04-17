const express = require('express');
const router = express.Router();
const favTopicsController = require('../controllers/favTopicsControllers');

router.route('/').get(favTopicsController.getFavTopics);

router.route('/').post(favTopicsController.setFavTopics);

router.route('/').patch(favTopicsController.updateFavTopics);

router.route('/addToFav').patch(favTopicsController.updateAddOneFavTopic);

router.route('/deleteFromFav').patch(favTopicsController.deleteOneFavTopic);

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