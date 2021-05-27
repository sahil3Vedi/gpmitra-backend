import express, { Application, Request, Response, NextFunction } from 'express'
const router  = express.Router()
const Doctor = require('../models/Doctor')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/',(req: Request,res: Response) => {
    return res.status(200).json({message:'We are on doctors'})
})

// Register Doctor
router.post('/register', async (req: Request,res: Response) => {
    const {email, password, name, qualification, organisation, phone} = req.body
    //Simple Validation
    if (!email || !password){
        return res.status(400).json({message: 'Please enter all fields'})
    }
    // Check existing Doctors
    const doctorFound = await Doctor.findOne({email})
    if (doctorFound) return res.status(300).json({message: 'This Email ID is already registered'})
    // Create new Doctor
    const newDoctor = new Doctor({email, password, name, qualification, organisation, phone})
    // Create Salt and Hash
    const salt = await bcrypt.genSalt(14)
    const hash = await bcrypt.hash(newDoctor.password,salt)
    newDoctor.password = hash
    //Save Doctor
    const savedDoctor = await newDoctor.save()
    jwt.sign(
        {id: savedDoctor.id},
        process.env.JWT_SECRET,
        {expiresIn: 3600},
        (err: any, token: string) => {
            if (err) throw err
            res.status(200).json({
                message: "Doctor Registered",
                token,
                savedDoctor
            })
        }
    )
})

//Login a Doctor
router.post('/login',async(req: Request,res: Response) => {
    const {email,password} = req.body
    // Simple Validation
    if (!email || !password){
        return res.status(400).json({message: 'Please enter all fields'})
    }
    // Check existing superusers
    try{
        const doctorFound = await Doctor.findOne({email})
        if (!doctorFound) return res.status(404).json({message: 'Doctor does not exist'})
        // Validate Password
        const isMatch = await bcrypt.compare(password, doctorFound.password)
        console.log(isMatch)
        if (!isMatch) return res.status(403).json({message: 'Password is incorrect'})
        // Sign Token
        const token = await jwt.sign({id: doctorFound.id},process.env.JWT_SECRET,{expiresIn: 3600},)
        res.status(200).json({message: 'Authenticated',token,username: doctorFound.email})
    } catch (err){
        res.status(400).json({message: 'Unable to check for existing Doctors'})
        console.log(err)
    }
})

module.exports = router
