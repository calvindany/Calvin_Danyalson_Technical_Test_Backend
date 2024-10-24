const express = require('express')
const router = express.Router();

const {
    getLeads,
    createLeads,
} = require("../controller/LeadsController");

router.get('/leads', getLeads);
router.post('/leads', createLeads);

module.exports = router;
