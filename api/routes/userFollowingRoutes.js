const express = require('express');
const router = express.Router();
const userFollowingControllers = require('../controllers/userFollowingControllers');

router.route('/').get(userFollowingControllers.getFollowings);

router.route('/').post(userFollowingControllers.setFollowings);

router.route('/').patch(userFollowingControllers.updateFollowings);

router.route('/').delete(userFollowingControllers.deleteFollowings);

module.exports = router;