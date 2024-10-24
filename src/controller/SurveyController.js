const { count, eq } = require('drizzle-orm');

const { getDb } = require('../db/');
const { Leads, Survey } = require("../db/schema");
const { SURVEY_STATUS_ON_REVIEW, LEADS_SURVEY_REQUEST_STATUS } = require("../constants/global");
const { GenerateResponse } = require('../helpers/response');

exports.createSurveyRequest = async (req, res) => {
    const db = getDb();

    const { leads_id, survey_notes } = req.body;

    try {
        const data = await db.select({ count: count() })
        .from(Leads).where({ pk_tr_lead: leads_id });

        if (data[0].count < 1) {
            const result = GenerateResponse(404, "Leads Not Found", null, null)
            return res.status(404).send(result);
        }

        await db.update(Leads)
            .set({ fk_ms_status: LEADS_SURVEY_REQUEST_STATUS }).where({ pk_tr_lead: leads_id });

        await db.insert(Survey).values({
            fk_tr_lead: leads_id,
            survey_notes: survey_notes,
            status: SURVEY_STATUS_ON_REVIEW,
            created_by: 0,
        })

        const result = GenerateResponse(200, "Survey Requested", req.body, null);

        return res.status(200).send(result)
    } catch (err) {
        console.log(err.message)
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result);
    }

}