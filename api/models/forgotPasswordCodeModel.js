const mongoose = require('mongoose');

const codeModel = mongoose.Schema({
    code:{
        type: Number,
        required: true
    },
    expiresIn:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("ForgotPassCode", codeModel);