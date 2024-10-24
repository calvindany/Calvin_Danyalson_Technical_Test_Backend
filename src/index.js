require("dotenv").config();

const express = require("express");
const { urlencoded, json } = require("express");
const { initDb } = require('./db');
const CustomerServiceRoute = require("./routes/customerService");
const SalesPersonRoute = require("./routes/salesPerson");
const Master = require("./routes/master");

const app = express();


async function  startServer() {
    await initDb();
    console.log('Database initialized successfully.');

    app.use(express.json())
    
    // GET request
    app.use("/api", CustomerServiceRoute)
    app.use("/api", SalesPersonRoute)
    app.use("/api", Master)
    
    const APP_PORT = process.env.APP_PORT || 3000;
    
    app.listen(APP_PORT, () => {
        console.log(`Server running on http://localhost:${APP_PORT}`);
    });
}

startServer();