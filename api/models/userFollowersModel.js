const mongoose = require('mongoose');

const userFollowersSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followerCount: {
        type: Number,
        default: 0,
        required: true
    },
    followersUid: {
        type: [
            {
                followerUid: {type: String},
                isFollowing: {type: Boolean}
            },
            
        ],
        default: []
    }
})

module.exports = mongoose.model('userFollowers', userFollowersSchema);