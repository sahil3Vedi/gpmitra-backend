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
const Appointment = require('./models/Appointment');
const moment = require('moment');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
function clearAppointments() {
    // Connect to DB
    mongoose.connect(process.env.DB_CONNECTION || "", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => { console.log(err); });
    mongoose.connection.on('connected', function () {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    });
}
clearAppointments();
