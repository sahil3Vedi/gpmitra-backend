"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function authdoctor(req, res, next) {
    const token = req.header('x-auth-token');
    // Check for token
    if (!token)
        res.status(401).json({ message: 'No Token, Authorization Denied' });
    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add doctor from payload
        req.body.doctor = decoded;
        next();
    }
    catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}
module.exports = authdoctor;
