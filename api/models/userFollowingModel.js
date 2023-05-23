const mongoose = require('mongoose');

const userFollowingSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followingCount: {
        type: Number,
        default: 0,
        required: true
    },
    followingsUid: {
        type: [
            {
                followingUid: String,
                isFollowingBack: Boolean
            }
        ],
        default: []
    }
})

module.exports = mongoose.model('userFollowings', userFollowingSchema);