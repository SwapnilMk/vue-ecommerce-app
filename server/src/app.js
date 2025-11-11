const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const corsOptions = require("./config/cors");
const v1Routes = require("./routes/v1/index.js");
require("dotenv").config();

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Security and CORS setup
app.use(helmet());
app.use(cors(corsOptions));


// Routes
app.use("/api/v1", v1Routes);

// routes
app.get("/", (req, res) => {
    res.send("server is running!");
});

// 404 handler 
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`,
    });
});


module.exports = app;
