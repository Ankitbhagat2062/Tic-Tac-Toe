const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const initializeSocket = require('./server/services/socketService');


// start 
require('dotenv').config();
const mongoose = require('mongoose');
require('./server/passport/passport');
const passport = require('passport');
const configs = require('./server/configs/config');
// end 

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);

//Apply Socket Middleware before routes
app.use((req, res, next) => {
    req.io = io;
    req.socketUserMap = io.socketUserMap;
    next();
});

// Authentication middleware
app.use(express.json());
let origin = [process.env.FRONTEND_URL, "http://localhost:5173"];
app.use(cors({
    origin: origin, // Vite's default port
    credentials: true
}));

// from here 
app.use(require('morgan')('dev'));
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(configs.dbURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Authentication routes
app.use('/auth', require('./server/routes/auth'));

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
