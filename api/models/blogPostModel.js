const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    topic: {
        type: Number,
        required: true
    },
    publishedAt: {
        type: Date,
        default: function() {
            return new Date();
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    coverImage: {
        type: String,
        default: ""
    },
    readMinute: {
        type: Number,
        required: true
    },
    views: {
        type: [String]
    },
    noOfViews: {
        type: Number,
        default: 0
    },
    likes: {
        type: [String]
    },
    noOfLikes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('blogPost', blogPostSchema);