export {}

const mongoose = require('mongoose')

const PatientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    occupation: {
        type: String,
    },
    dob:{
        type: Date,
    },
    age:{
        type: Number,
        required: true
    },
    community:{
        type: String,
    },
    doctor:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Patient',PatientsSchema)
