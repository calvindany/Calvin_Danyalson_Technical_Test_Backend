require("dotenv").config();

const express = require("express");
const { urlencoded, json } = require("express");
const { initDb } = require('./db');
const LeadsController = require("./routes/leads");

const app = express();


async function  startServer() {
    await initDb();
    console.log('Database initialized successfully.');

    app.use(urlencoded({ extended: true }));
    app.use(json());
    
    // GET request
    app.use("/", LeadsController)
    
    const APP_PORT = process.env.APP_PORT || 3000;
    
    app.listen(APP_PORT, () => {
        console.log(`Server running on http://localhost:${APP_PORT}`);
    });
}

startServer();