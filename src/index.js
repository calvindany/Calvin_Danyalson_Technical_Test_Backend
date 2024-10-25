require("dotenv").config();

const express = require("express");
const { urlencoded, json } = require("express");
const path = require('path');
const { initDb } = require('./db');
const Router = require("./routes/router");
const app = express();


async function  startServer() {
    await initDb();
    console.log('Database initialized successfully.');

    app.use(express.json())
    
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use("/api", Router)
    
    const APP_PORT = process.env.APP_PORT || 3000;
    
    app.listen(APP_PORT, () => {
        console.log(`Server running on http://localhost:${APP_PORT}`);
    });
}

startServer();