const mongoose = require('mongoose');

const userFollowersSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    followerCount: {
        type: Number,
        required: true
    },
    followersUid: [
            {
                followerUid: {type: String},
                isFollowing: {type: Boolean}
            }
        ]
})

module.exports = mongoose.model('userFollowers', userFollowersSchema);