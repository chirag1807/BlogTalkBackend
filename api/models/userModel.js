const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // uid: {
    //     type: String
    // },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    sendEmail: {
        type: Boolean,
        default: true
    },
    sendNotification: {
        type: Boolean,
        default: true
    },
    favTopicsCount: {
        type: Number,
        default: 0
    },
    favTopics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'favTopics',
        require: true,
        auto: true
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userFollowers',
        require: true,
        auto: true
    },
    followingsCount: {
        type: Number,
        default: 0
    },
    followings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userFollowings',
        require: true,
        auto: true
    },
    muted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Muted',
        require: true,
        auto: true
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationSchema',
        require: true,
        auto: true
    },
    deviceToken: {
        type: String
    }
});

module.exports = mongoose.model('User',userSchema);