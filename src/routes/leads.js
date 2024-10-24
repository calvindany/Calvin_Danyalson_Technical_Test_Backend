const express = require('express')
const router = express.Router();

const {
    getLeads,
    createLeads,
    updateLeadsStatus,
    postFollowUp
} = require("../controller/LeadsController");

router.get('/leads', getLeads);
router.post('/leads', createLeads);
router.put('/leads/:leadsId', updateLeadsStatus);

router.post('/leads/followUp', postFollowUp);

module.exports = router;
