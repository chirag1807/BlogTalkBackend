const mongoose = require('mongoose');

const favTopicSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    favTopicsCount: {
        type: Number,
    },
    favTopics: {
        type: [String],
    }
});

module.exports = mongoose.model('favTopics',favTopicSchema);