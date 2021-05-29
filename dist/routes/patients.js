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
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const authdoctor = require('../middleware/authdoctor');
const moment = require('moment');
// add a new Patient to DB
router.post('/create', authdoctor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Doctor
    const doctorFound = yield Doctor.findById(req.body.doctor.id);
    if (!doctorFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    const doctor = doctorFound._id;
    const created_at = moment.utc().valueOf();
    // Creating new Patient
    const { name, gender, email, phone, address, occupation, dob, age, community } = req.body;
    const newPatient = new Patient({ name, email, gender, phone, address, occupation, dob, age, community, doctor, created_at });
    try {
        const savedPatient = yield newPatient.save();
        res.status(200).json({ ok: true, message: 'Patient Added' });
    }
    catch (_a) {
        res.status(400).json({ ok: false, message: 'Unable to Add Patient' });
    }
}));
router.get('/fetch', authdoctor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Doctor
    const doctorFound = yield Doctor.findById(req.body.doctor.id);
    if (!doctorFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    const doctorId = doctorFound._id;
    try {
        const patients = yield Patient.find({ doctor: doctorId });
        res.status(200).json({ message: patients });
    }
    catch (e) {
        res.status(404).json({ message: 'Unable to fetch Patients' });
    }
}));
module.exports = router;
