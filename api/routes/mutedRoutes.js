const express = require('express');
const router = express.Router();
const mutedWriterTopicControllers = require('../controllers/mutedControllers');

router.route('/').get(mutedWriterTopicControllers.getMutedTopicWrites);

router.route('/').post(mutedWriterTopicControllers.setMutedTopicWrites);

router.route('/addWriter').patch(mutedWriterTopicControllers.updateMutedAddWriter);
router.route('/removeWriter').patch(mutedWriterTopicControllers.updateMutedRemoveWriter);
router.route('/addTopic').patch(mutedWriterTopicControllers.updateMutedAddTopic);
router.route('/removeTopic').patch(mutedWriterTopicControllers.updateMutedRemoveTopic);

module.exports = router;