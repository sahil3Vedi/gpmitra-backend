import express, { Application, Request, Response, NextFunction } from 'express'
const router  = express.Router()
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const authdoctor = require('../middleware/authdoctor')

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

router.delete('/cancel/:id', authdoctor, async(req: Request, res: Response)=>{
    // Authenticating Doctor
    const doctorFound = await Doctor.findById(req.body.doctor.id)
    if (!doctorFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    const doctorId = doctorFound._id
    const apptId = req.params.id
    try{
        const appointmentFound = await Appointment.findById(apptId)
        if (!appointmentFound) return res.status(404).json({message: 'No such appointment exists'})
        const doctorMatch = (appointmentFound.doctor.toString() === doctorId.toString())
        if (doctorMatch){
            appointmentFound.remove().then(()=>{return res.status(200).json({message: 'Appointment Cancelled'})})
        } else {
            return res.status(401).json({message: 'Doctor not authorised'})
        }
    } catch(e){
        res.status(404).json({message: 'Unable to cancel Appointment'})
    }
})




module.exports = router
