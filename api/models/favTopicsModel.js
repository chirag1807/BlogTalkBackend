const mongoose = require('mongoose');

const favTopicSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    favTopicsCount: {
        type: Number,
    },
    favTopics: {
        type: [String],
    }
});

module.exports = mongoose.model('favTopics',favTopicSchema);