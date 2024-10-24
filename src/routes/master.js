const express = require('express')
const router = express.Router();

const {
    getMasterStatus
} = require("../controller/MasterController");

router.get('/status', getMasterStatus);

module.exports = router;
