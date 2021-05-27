"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const app = express_1.default();
app.use(body_parser_1.default.json());
//options for cors midddleware
const options = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: [process.env.ADMIN_FRONTEND, process.env.FRONTEND],
    preflightContinue: true,
};
// Access Control Headers
app.use(function (req, res, next) {
    const allowedOrigins = [process.env.ADMIN_FRONTEND, process.env.FRONTEND, `http://localhost:9000`];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE");
    next();
});
//Import Routes
const superusersRoute = require('./routes/superusers');
app.use('/superusers', superusersRoute);
const doctorsRoute = require('./routes/doctors');
app.use('/doctors', doctorsRoute);
// use cors middleware
app.use(cors_1.default(options));
// Connect to DB
mongoose_1.default.connect(process.env.DB_CONNECTION || "", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => { console.log(err); });
app.listen(process.env.PORT || 2000, () => console.log("Listening..."));
