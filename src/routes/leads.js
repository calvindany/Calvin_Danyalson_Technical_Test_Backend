const express = require('express')
const router = express.Router();

const {
    getLeads,
    createLeads,
    updateLeadsStatus
} = require("../controller/LeadsController");

router.get('/leads', getLeads);
router.post('/leads', createLeads);
router.put('/leads/:leadsId', updateLeadsStatus);

module.exports = router;
