const { count, eq } = require('drizzle-orm');

const { getDb } = require('../db/');
const { Leads, Survey } = require("../db/schema");
const { SURVEY_STATUS, LEADS_SURVEY_REQUEST_STATUS, UPLOADS_FOLDER_PATH_PREFIX, LEADS_SURVEY_COMPLETE_STATUS } = require("../constants/global");
const { GenerateResponse } = require('../helpers/response');

exports.createSurveyRequest = async (req, res) => {
    const db = getDb();

    const { leads_id, survey_request_notes } = req.body;

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
            survey_request_notes: survey_request_notes,
            survey_result_notes: "",
            image_path: "",
            status: SURVEY_STATUS[0],
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

exports.putApproveDisapproveRequest = async (req, res) => {
    const db = getDb();
    const { survey_id, status } = req.body;

    try {

        if(!SURVEY_STATUS.includes(status)) {
            const result = GenerateResponse(404, "Status Not Found", null, null);
            return res.status(404).send(result);
        }

        await db.update(Survey)
            .set({ status: status }).where({ pk_tr_survey: survey_id });
         
        const result = GenerateResponse(200, "Survey Status Updated, Please Upload Photo and Notes During the Survey", req.body, null);
        return res.status(200).send(result)
    } catch (err) {
        console.log(err.message)
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result);
    }
}

exports.putCompleteSurveyRequest = async (req, res) => {
    const db = getDb()
    const { survey_id, survey_result_notes } = req.body
    const filename = req.file.filename

    try {
        if (!filename) {
            const result = GenerateResponse(400, "Uploaded File Not FOund", null, null)
            return res.status(400).send(result);
        }
        
        await db.update(Survey)
            .set({ survey_result_notes: survey_result_notes, image_path: UPLOADS_FOLDER_PATH_PREFIX + filename })
        
        const leads = await db.select({ fk_tr_lead: Survey.fk_tr_lead }).from(Survey).where({ pk_tr_survey: survey_id });
        await db.update(Leads)
            .set({ fk_ms_status: LEADS_SURVEY_COMPLETE_STATUS }).where({ pk_tr_lead: leads.fk_tr_lead });
            
        const result = GenerateResponse(200, "Survey Completed", req.body, null);
        return res.status(200).send(result);
    } catch (err) {
        console.log(err.message)
        const result = GenerateResponse(500, "Internal Server Error", null, err.message);
        return res.status(500).send(result);
    }
}