const express = require('express');
const router = express.Router();
const topicNameIdsControllers = require('../controllers/topicNameIds');

router.route('/').get(topicNameIdsControllers.getTopicNameId);
router.route('/all').get(topicNameIdsControllers.getAllTopicNameIds);
router.route('/').post(topicNameIdsControllers.setTopicNameId);
router.route('/').patch(topicNameIdsControllers.updateTopicName);
router.route('/').delete(topicNameIdsControllers.deleteTopic);

module.exports = router;