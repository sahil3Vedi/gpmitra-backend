import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local' })

const app: Application = express()
app.use(bodyParser.json())

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: [process.env.ADMIN_FRONTEND!, process.env.FRONTEND!],
  preflightContinue: true,
}

// Access Control Headers
app.use(function(req: Request,res: Response,next: NextFunction){
    const allowedOrigins = [process.env.ADMIN_FRONTEND!, process.env.FRONTEND!, `http://localhost:9000`];
    const origin: string = req.headers.origin!;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token")
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE")
    next()
})

//Import Routes
const superusersRoute = require('./routes/superusers')
app.use('/superusers',superusersRoute)

const doctorsRoute = require('./routes/doctors')
app.use('/doctors',doctorsRoute)

const patientsRoute = require('./routes/patients')
app.use('/patients',patientsRoute)

// use cors middleware
app.use(cors(options))

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION || "",
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err)=>{console.log(err)}
)

app.listen(process.env.PORT || 2000, () => console.log("Listening..."))
