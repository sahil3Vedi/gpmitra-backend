const Appointment = require('./models/Appointment')
const moment = require('moment')
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local' })

function clearAppointments(){
    // Connect to DB
    mongoose.connect(
        process.env.DB_CONNECTION || "",
        {useNewUrlParser: true, useUnifiedTopology: true},
        (err: any)=>{console.log(err)}
    )
    mongoose.connection.on('connected', async function () {
        // Fetch Appointments more than 1 hours due
        const yesterDate = moment().subtract(1, 'd')
        const oldAppointments = await Appointment.find({ date:{$lt: yesterDate } })
        console.log(oldAppointments)
        if (oldAppointments) {
            for (var oldAppt in oldAppointments){
                const appt = await Appointment.findById(oldAppointments[oldAppt]._id)
                appt.remove().then(()=>console.log("Old Appointment Removed"))
            }
        }
    })
}

clearAppointments()
