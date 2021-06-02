import express, { Application, Request, Response, NextFunction } from 'express'
const router  = express.Router()
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const authdoctor = require('../middleware/authdoctor')
const moment = require('moment')

// add a new Patient to DB
router.post('/create', authdoctor, async(req: Request, res: Response) => {
    // Authenticating Doctor
    const doctorFound = await Doctor.findById(req.body.doctor.id)
    if (!doctorFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    const doctor = doctorFound._id
    const created_at = moment.utc().valueOf()
    // Creating new Patient
    const {name, gender, email, phone, address, occupation, dob, age, community} = req.body
    const newPatient =  new Patient({name, email, gender, phone, address, occupation, dob, age, community, doctor, created_at})
    try{
        const savedPatient = await newPatient.save()
        res.status(200).json({ok: true, message: 'Patient Added'})
    } catch {
        res.status(400).json({ok: false, message: 'Unable to Add Patient'})
    }
})

// fetches all patients of Doctor
router.get('/fetch', authdoctor, async(req: Request, res: Response) =>{
    // Authenticating Doctor
    const doctorFound = await Doctor.findById(req.body.doctor.id)
    if (!doctorFound) return res.status(404).json({message: 'Token is not valid (sneak)'})
    const doctorId = doctorFound._id
    try{
        const patients = await Patient.find({doctor:doctorId})
        res.status(200).json({message: patients})
    } catch(e) {
        res.status(404).json({message: 'Unable to fetch Patients'})
    }
})

module.exports = router
