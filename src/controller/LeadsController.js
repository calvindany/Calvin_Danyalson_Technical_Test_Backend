const { count, eq, sql, and, or, isNull } = require('drizzle-orm');
const moment = require('moment');

const { getDb } = require('../db/');
const { Leads, Status, FollowUp, Internals, LogsSuspended } = require("../db/schema");
const constant = require("../constants/global");
const service = require("../service/UserService");

const { GenerateResponse, GenerateLeadsMappingData } = require("../helpers/response");
const { assign } = require('nodemailer/lib/shared');
const { notBetween } = require('drizzle-orm');
const { between } = require('drizzle-orm');

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
        const now = moment();
        const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');

        const { email, phone_number } = req.body;
        
        const sales = await db.select({
            pk_ms_internal: Internals.pk_ms_internal,
            fullname: Internals.fullname,
        })
        .from(Internals)
        .leftJoin(LogsSuspended, eq(Internals.pk_ms_internal, LogsSuspended.fk_ms_internal))
        .where(
            and(
                {fk_ms_role: constant.SALES_PERSON_ROLE_ID},
                or(
                    isNull(LogsSuspended.fk_ms_internal),
                    notBetween(formattedDate, LogsSuspended.start_date, LogsSuspended.end_date)
                )
            )
        );

        const sortedSales = sales.sort((a, b) => a.pk_ms_internal - b.pk_ms_internal)
        const assignedSales = await service.AssignSalesWithLeads(sortedSales)

        await db.insert(Leads).values({
            client_email: email,
            client_phone_number: phone_number,
            fk_ms_status: constant.LEADS_NEW_STATUS,
            assigned: assignedSales.pk_ms_internal,
            created_by: 0,
        });

        const constructDataResponse = {
            ...req.body,
            assigned: assignedSales
        }

        const result = GenerateResponse(200, "Success", constructDataResponse, null);
        return res.status(200).send(result)
    } catch(err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
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
        
        const leads = await db.select().from(Leads).where({ pk_tr_lead: leadsId });

        const constructDataResponse = {
            leadsId: leadsId,
            status: status,
        }

        if (status == constant.LEADS_DEAL_STATUS) {
            constructDataResponse.notes = await service.CreateUserService(leads[0].client_email, leads[0].client_phone_number)
        }

        const result = GenerateResponse(200, "Success Update Status", constructDataResponse, null);
        return res.status(200).send(result);
        
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result);
    }
}

exports.putUpdateLeadsAssignee = async (req, res) => {
    const db = getDb();

    const { leads_id, sales_id } = req.body;

    try {

        const leads = await db.select().from(Leads).where({ pk_tr_lead: leads_id });

        if(leads.length < 1) {
            const result = GenerateResponse(404, "Status Not Found", null, null);
            return res.status(404).send(result);
        }

        if(leads[0].assigned == sales_id) {
            const result = GenerateResponse(400, "The Leads already assigned to this sales", req.body, null);
            return res.status(400).send(result);
        }

        await db.update(Leads).set({ assigned: sales_id }).where({ pk_tr_lead: leads_id });

        const result = GenerateResponse(200, `Success Update Leads Assignee to ${ sales_id }`, req.body, null);
        return res.status(200).send(result);
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
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

exports.putUpdateFollowUp = async (req, res) => {
    const db = getDb();

    const { leads_id, follow_up_id, follow_up_message, follow_up_result } = req.body;

    try {
        await db.update(FollowUp)
            .set({ follow_up_message: follow_up_message, follow_up_result: follow_up_result })
            .where(sql`${FollowUp.fk_tr_lead} = ${leads_id} AND ${FollowUp.pk_tr_follow_up} = ${follow_up_id}`);

        const result = GenerateResponse(200, "Success", req.body, null);
        return res.status(200).send(result);
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result)
    }
}