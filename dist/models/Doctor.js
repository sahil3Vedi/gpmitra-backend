"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const DoctorsSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    organisation: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Doctor', DoctorsSchema);
