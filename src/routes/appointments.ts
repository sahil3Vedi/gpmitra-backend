import express, { Application, Request, Response, NextFunction } from 'express'
const router  = express.Router()
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const authdoctor = require('../middleware/authdoctor')
const cron = require('node-cron')
const moment = require('moment')

// add new Appointment to DB
router.post('/create', authdoctor, async(req: Request, res: Response) => {
    // Authenticating Doctor
    const doctorFound = await Doctor.findById(req.body.doctor.id)
    if (!doctorFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    const doctor = doctorFound._id
    // Creating new Appointment
    const {patient, date, time} = req.body
    const newAppointment =  new Appointment({patient, date, time, doctor})
    try{
        const savedAppointment = await newAppointment.save()
        res.status(200).json({ok: true, message: 'Appointment Added'})
    } catch {
        res.status(400).json({ok: false, message: 'Unable to Add Appointment'})
    }
})

// fetch all appointments from DB
router.get('/fetch', authdoctor, async(req: Request, res: Response) => {
    // Authenticating Doctor
    const doctorFound = await Doctor.findById(req.body.doctor.id)
    if (!doctorFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    const doctorId = doctorFound._id
    try{
        const appointments = await Appointment.find({doctor:doctorId})
        res.status(200).json({message: appointments})
    } catch(e) {
        res.status(404).json({message: 'Unable to fetch Appointments'})
    }
})

// Every Day, Appointments more than 24 hours due
cron.schedule('* 0 * * *', async() => {
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
});


module.exports = router
