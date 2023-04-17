const mongoose = require('mongoose');

const userFollowingSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followingCount: {
        type: Number,
        required: true
    },
    followingsUid: {
        type: [
            {
                followingUid: String,
                isFollowingBack: Boolean
            }
        ],
    }
})

module.exports = mongoose.model('userFollowings', userFollowingSchema);