const mongoose = require('mongoose');

const vdataSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Number
    },
    
    videoID: {
        required: true,
        type: String
    }
})



module.exports = mongoose.model('vData', vdataSchema)