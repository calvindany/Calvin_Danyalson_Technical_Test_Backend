const express = require('express')
const router = express.Router();

const {
    updateLeadsStatus,
    postFollowUp
} = require("../controller/LeadsController");

router.put('/leads/:leadsId', updateLeadsStatus);

router.post('/leads/followUp', postFollowUp);

module.exports = router;
