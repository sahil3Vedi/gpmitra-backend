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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    return res.status(200).json({ message: 'We are on doctors' });
});
// Register Doctor
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, qualification, organisation, phone } = req.body;
    //Simple Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    // Check existing Doctors
    const doctorFound = yield Doctor.findOne({ email });
    if (doctorFound)
        return res.status(300).json({ message: 'This Email ID is already registered' });
    // Create new Doctor
    const newDoctor = new Doctor({ email, password, name, qualification, organisation, phone });
    // Create Salt and Hash
    const salt = yield bcrypt.genSalt(14);
    const hash = yield bcrypt.hash(newDoctor.password, salt);
    newDoctor.password = hash;
    //Save Doctor
    const savedDoctor = yield newDoctor.save();
    jwt.sign({ id: savedDoctor.id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err)
            throw err;
        res.status(200).json({
            message: "Doctor Registered",
            token,
            savedDoctor
        });
    });
}));
//Login a Doctor
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Simple Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    // Check existing superusers
    try {
        const doctorFound = yield Doctor.findOne({ email });
        if (!doctorFound)
            return res.status(404).json({ message: 'Doctor does not exist' });
        // Validate Password
        const isMatch = yield bcrypt.compare(password, doctorFound.password);
        console.log(isMatch);
        if (!isMatch)
            return res.status(403).json({ message: 'Password is incorrect' });
        // Sign Token
        const token = yield jwt.sign({ id: doctorFound.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(200).json({ message: 'Authenticated', token, username: doctorFound.email });
    }
    catch (err) {
        res.status(400).json({ message: 'Unable to check for existing Doctors' });
        console.log(err);
    }
}));
module.exports = router;
