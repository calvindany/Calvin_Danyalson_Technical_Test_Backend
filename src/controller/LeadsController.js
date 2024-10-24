const { count, eq } = require('drizzle-orm');

const { getDb } = require('../db/');
const { Leads, Status, FollowUp } = require("../db/schema");
const { LEADS_NEW_STATUS } = require("../constants/global");

const { GenerateResponse, GenerateLeadsMappingData } = require("../helpers/response");

exports.getLeads = async (req, res, next) => {
    const db = getDb();  // Get the initialized db

    try {
        const data = 
            await db.select({
                pk_tr_lead: Leads.pk_tr_lead,
                client_email: Leads.client_email,
                client_phone_number: Leads.client_phone_number,
                follow_up: FollowUp
            }).from(Leads)
            .leftJoin(FollowUp, eq(Leads.pk_tr_lead, FollowUp.fk_tr_lead));

        const restructuredData = GenerateLeadsMappingData(data)    

        const result = GenerateResponse(200, "Success", restructuredData, null)
        return res.status(200).send(result)

    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err)
        return res.status(500).send(result)
    }
}

exports.getLeadsBySales = async (req, res) => {
    const db = getDb();

    const { salesId } = req.params;

    console.log(salesId)
    try {
        const data = 
            await db.select({
                pk_tr_lead: Leads.pk_tr_lead,
                client_email: Leads.client_email,
                client_phone_number: Leads.client_phone_number,
                follow_up: {
                    pk_tr_follow_up: FollowUp.pk_tr_follow_up,
                    follow_up_message: FollowUp.follow_up_message,
                    follow_up_result: FollowUp.follow_up_result,
                    created_at: FollowUp.created_at,
                }
            }).from(Leads)
            .leftJoin(FollowUp, eq(Leads.pk_tr_lead, FollowUp.fk_tr_lead)).where(eq(Leads.assigned, salesId));
        
        const restructuredData = GenerateLeadsMappingData(data);

        const result = GenerateResponse(200, "Success", restructuredData, null)
        return res.status(200).send(result)

    } catch (err) {
        console.log(err.message);
        const result = GenerateResponse(500, "Internal Server Error", null, err.message)
        return res.status(500).send(result)
    }
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

        const result = GenerateResponse(200, "Success", req.body, null);
        return res.status(200).send(result)
    } catch(err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err);
        return res.status(500).send(result)
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
            const result = GenerateResponse(404, "Status Not Found", null, null);
            return res.status(404).send(result);
        }
        
        await db.update(Leads)
            .set({ fk_ms_status: status }).where({ pk_tr_lead: leadsId });
        
        const constructDataResponse = {
            leadsId: leadsId,
            status: status,
        }

        const result = GenerateResponse(200, "Success Update Status", constructDataResponse, null);
        return res.status(200).send(result);
        
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err);
        return res.status(500).send(result);
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