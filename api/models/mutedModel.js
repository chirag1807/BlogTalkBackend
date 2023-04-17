const mongoose = require('mongoose');

const mutedSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    writerCount: {
        type: Number,
        default: 0
    },
    writerIds: {
        type: [String]
    },
    topicCounts: {
        type: Number,
        default: 0
    },
    topicIds: {
        type: [String]
    }
});

module.exports = new mongoose.model('Muted', mutedSchema);