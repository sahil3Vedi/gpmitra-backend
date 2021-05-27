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
const Superuser = require('../models/Superuser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    return res.status(200).json({ message: 'We are on superusers' });
});
// ***************DO NOT COMMENT THIS OUT**********************
//
//Create a new Superuser
// router.post('/spawnSuperuser', async (req: Request,res: Response) => {
//     const {username,password} = req.body
//     //Simple Validation
//     if (!username || !password){
//         return res.status(400).json({message: 'Please enter all fields'})
//     }
//     // Check existing Superusers
//     const superuserFound = await Superuser.findOne({username})
//     if (superuserFound) return res.status(300).json({message: 'Superuser already exists'})
//     // Create new Superuser
//     const newSuperuser = new Superuser({username,password})
//     // Create Salt and Hash
//     const salt = await bcrypt.genSalt(14)
//     const hash = await bcrypt.hash(newSuperuser.password,salt)
//     newSuperuser.password = hash
//     //Save Superuser
//     const savedSuperuser = await newSuperuser.save()
//     jwt.sign(
//         {id: savedSuperuser.id},
//         process.env.JWT_SECRET,
//         {expiresIn: 3600},
//         (err: any, token: string) => {
//             if (err) throw err
//             res.status(200).json({
//                 message: "superuser created",
//                 token,
//                 savedSuperuser
//             })
//         }
//     )
// })
//
// ************************************************************
//Login a superuser
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Simple Validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    // Check existing superusers
    try {
        const superuserFound = yield Superuser.findOne({ username });
        if (!superuserFound)
            return res.status(404).json({ message: 'Superuser does not exist' });
        // Validate Password
        const isMatch = yield bcrypt.compare(password, superuserFound.password);
        console.log(isMatch);
        if (!isMatch)
            return res.status(403).json({ message: 'Password is incorrect' });
        // Sign Token
        const token = yield jwt.sign({ id: superuserFound.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.status(200).json({ message: 'Authenticated', token, username: superuserFound.username });
    }
    catch (err) {
        res.status(400).json({ message: 'Unable to check for existing users' });
        console.log(err);
    }
}));
module.exports = router;
