export {}

const mongoose = require('mongoose')

const DoctorsSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Doctor',DoctorsSchema)
