const mongoose = require('mongoose');

const userFollowersSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
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