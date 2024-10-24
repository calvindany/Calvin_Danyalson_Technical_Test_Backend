const { getDb } = require('../db/');
const { Leads } = require("../db/schema");


exports.getLeads = async (req, res, next) => {
    const db = getDb();  // Get the initialized db
    const data = 
        await db.select().from(Leads);

    res.status(200).send(data)
}