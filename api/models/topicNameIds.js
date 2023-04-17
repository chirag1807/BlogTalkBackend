const mongoose = require('mongoose');

const topicNameIdsSchema = mongoose.Schema({
    topicId: {
        type: Number,
        required: true,
        unique: true,
        default: 1
    },
    topicName: {
        type: String,
        required: true,
    },
    followed: {
        type: Number,
        default: 0
    },
    muted: {
        type: Number,
        default: 0
    },
});

module.exports = new mongoose.model('TopicNameIds', topicNameIdsSchema);