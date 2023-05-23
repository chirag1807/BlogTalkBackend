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
        type: [String],
        default: []
    },
    topicCounts: {
        type: Number,
        default: 0
    },
    topicIds: {
        type: [String],
        default: []
    }
});

module.exports = new mongoose.model('Muted', mutedSchema);