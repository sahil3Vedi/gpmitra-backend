"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const authdoctor = require('../middleware/authdoctor');
const cron = require('node-cron');
const moment = require('moment');
// add new Appointment to DB
router.post('/create', authdoctor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Doctor
    const doctorFound = yield Doctor.findById(req.body.doctor.id);
    if (!doctorFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    const doctor = doctorFound._id;
    // Creating new Appointment
    const { patient, date, time } = req.body;
    const newAppointment = new Appointment({ patient, date, time, doctor });
    try {
        const savedAppointment = yield newAppointment.save();
        res.status(200).json({ ok: true, message: 'Appointment Added' });
    }
    catch (_a) {
        res.status(400).json({ ok: false, message: 'Unable to Add Appointment' });
    }
}));
// fetch all appointments from DB
router.get('/fetch', authdoctor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Doctor
    const doctorFound = yield Doctor.findById(req.body.doctor.id);
    if (!doctorFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    const doctorId = doctorFound._id;
    try {
        const appointments = yield Appointment.find({ doctor: doctorId });
        res.status(200).json({ message: appointments });
    }
    catch (e) {
        res.status(404).json({ message: 'Unable to fetch Appointments' });
    }
}));
// Every Day, Appointments more than 24 hours due
cron.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch Appointments more than 1 hours due
    const yesterDate = moment().subtract(1, 'd');
    const oldAppointments = yield Appointment.find({ date: { $lt: yesterDate } });
    console.log(oldAppointments);
    if (oldAppointments) {
        for (var oldAppt in oldAppointments) {
            const appt = yield Appointment.findById(oldAppointments[oldAppt]._id);
            appt.remove().then(() => console.log("Old Appointment Removed"));
        }
    }
}));
module.exports = router;
