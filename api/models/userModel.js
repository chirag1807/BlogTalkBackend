const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    uid: {
        type: String
    },
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
    }
});

module.exports = mongoose.model('User',userSchema);