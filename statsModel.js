const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Number
    },
    views: {
        required: true,
        type: Number
    },
    videoID: {
        required: true,
        type: String
    },
    videoName: {

    }
})



module.exports = mongoose.model('Data', dataSchema)