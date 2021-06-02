export {}

const mongoose = require('mongoose')

const AppointmentsSchema = mongoose.Schema({
    doctor:{
        type: String,
        required: true
    },
    patient:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Appointment',AppointmentsSchema)
