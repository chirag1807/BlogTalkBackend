const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    notificationCount: {
        type: Number,
        default: 0,
        required: true
    },
    notificationContent: {
        type: [
            {
                notificationId: Number,
                name: String,
                userId: String,
                blogId: String,
                content: String,
                time: {
                    type: Date,
                    default: function() {
                        return new Date();
                    }
                },
                image: {
                    type: String,
                    default: ""
                },
            }
        ],
        default: []
    }
})

module.exports = mongoose.model('notificationSchema', notificationSchema);