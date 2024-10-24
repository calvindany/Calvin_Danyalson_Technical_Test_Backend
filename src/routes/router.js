const express = require('express')
const router = express.Router();

const {
    getMasterStatus
} = require("../controller/MasterController");

const {
    getLeads,
    getLeadsBySales,
    createLeads,
    updateLeadsStatus,
    postFollowUp,
} = require("../controller/LeadsController");

// Master Data
router.get('/status', getMasterStatus);

// Leads Data
router.get('/leads', getLeads);
router.get('/leads/:salesId', getLeadsBySales);
router.post('/leads', createLeads);
router.put('/leads/:leadsId', updateLeadsStatus);
router.post('/leads/followUp', postFollowUp);

module.exports = router;
