
const { count } = require('drizzle-orm');

const { getDb } = require('../db/');
const { Status } = require("../db/schema");

const { GenerateResponse } = require("../helpers/response");

exports.getMasterStatus = async (req, res) => {
    const db = getDb();

    try {
        const data = await db.select().from(Status);

        const result = GenerateResponse(200, "Success", data, null);
        return res.status(200).send(result);
    } catch (err) {
        const result = GenerateResponse(500, "Internal Server Error", null, err);
        return res.status(500).send(result);
    }
}