const { and, gte, lte, eq, between } = require('drizzle-orm');
const moment = require('moment');

const { getDb } = require('../db/');
const { LogsSuspended } = require("../db/schema");
const constant = require("../constants/global");
const service = require("../service/UserService");
const { GenerateResponse } = require('../helpers/response');

exports.putSuspendSales = async (req, res) => {
    const db = getDb();
    
    const { sales_id, start_date, end_date } = req.body;

    try {
        const now = moment();
        const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');

        const suspended = await db.select().from(LogsSuspended)
            .where( and(
                {fk_ms_internal: sales_id},
                between(formattedDate, LogsSuspended.start_date, LogsSuspended.end_date)         // end_date >= hari ini
              ))
        
        if(suspended.length >= 1) {
            const result = GenerateResponse(400,  
                `Sales ${ sales_id } are still suspended from ${suspended[0].start_date} - ${suspended[0].end_date}`, 
                suspended[0],
                null
            )
            return res.status(400).send(result);
        }

        await db.insert(LogsSuspended).values({
            fk_ms_internal: sales_id,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            created_by: 0
        })

        const result = GenerateResponse(200, `Sales ${ sales_id } will be suspended on ${start_date} - ${end_date}`, req.body, null);
        return res.status(200).send(result);
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result);
    }
}