const express = require('express')
const router = express.Router();

const {
    getLeads
} = require("../controller/LeadsController");

router.get('/leads', getLeads);

module.exports = router;
