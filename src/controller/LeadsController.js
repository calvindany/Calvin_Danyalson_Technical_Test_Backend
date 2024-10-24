const { getDb } = require('../db/');
const { Leads } = require("../db/schema");
const { LEADS_NEW_STATUS } = require("../constants/global");

exports.getLeads = async (req, res, next) => {
    const db = getDb();  // Get the initialized db
    const data = 
        await db.select().from(Leads);

    res.status(200).send(data)
}

exports.createLeads = async (req, res, next) => {
    const db = getDb();

    try {
        const { email, phone_number } = req.body;
        
        await db.insert(Leads).values({
            client_email: email,
            client_phone_number: phone_number,
            fk_ms_status: LEADS_NEW_STATUS,
            assigned: 1,
            created_by: 0,
        });

        return res.status(200).send({status: "success"})
    } catch(err) {
        return res.status(500).send(err)
    }
}