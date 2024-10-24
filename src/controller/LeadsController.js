const { count } = require('drizzle-orm');

const { getDb } = require('../db/');
const { Leads, Status, FollowUp } = require("../db/schema");
const { LEADS_NEW_STATUS } = require("../constants/global");

const { GenerateResponse } = require("../helpers/response");

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

exports.updateLeadsStatus = async (req, res) => {
    const db = getDb();

    const { leadsId } = req.params;
    const { status } = req.body;

    try {
        const data = await db.select({ count: count() })
            .from(Status).where({ pk_ms_status: status });

        if (data[0].count < 1) {
            return res.status(404).send({ message: "Status Not Found" });
        }
        
        await db.update(Leads)
            .set({ fk_ms_status: status }).where({ pk_tr_lead: leadsId });
        
        return res.status(200).send({ message: "Success Update Status" });

    } catch (err) {
        return res.status(500).send(err);
    }
}

exports.getFollowUp = () => {
    const db = getDb();

    const { leadsId } = req.params;

    const followUpData = db.select().from(FollowUp).where({ fk_tr_lead: leadsId });

    return res.status(200).send({
        message: "Success",
        data: followUpData,
    })
}

exports.postFollowUp = async (req, res) => {
    const db = getDb();

    const { leads_id, follow_up_message, follow_up_result } = req.body;

    try {
        const data = await db.select({ count: count() })
        .from(Leads).where({ pk_tr_lead: leads_id });

        if (data[0].count < 1) {
            const result = GenerateResponse(404, "Leads Not Found", null, null)
            return res.status(404).send(result);
        }
        
        await db.insert(FollowUp).values({
            fk_tr_lead: leads_id,
            follow_up_message: follow_up_message,
            follow_up_result: follow_up_result,
            created_by: 0,
        })

        const result = GenerateResponse(200, "Success", req.body, null);

        return res.status(200).send(result)
    } catch (err) {
        console.log(err);

        const result = GenerateResponse(500, "Internal Server Error", null, err)
        return res.status(500).send(result);
    }
}