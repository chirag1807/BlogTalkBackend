const mongoose = require('mongoose');

const savePostSchema = mongoose.Schema({
    _id: {
        type: String,
        default: "645fc58821467d97be952cd2",
        required: true
    },
    uid: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('savePost', savePostSchema);