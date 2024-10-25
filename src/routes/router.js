const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    getMasterStatus
} = require("../controller/MasterController");

const {
    getLeads,
    getLeadsBySales,
    createLeads,
    updateLeadsStatus,
    putUpdateFollowUp,
    postFollowUp,
    putUpdateLeadsAssignee,
} = require("../controller/LeadsController");

const {
    createSurveyRequest,
    putApproveDisapproveRequest,
    putCompleteSurveyRequest
} = require("../controller/SurveyController");

const {
    putSuspendSales,
    getMasterInternals
} = require("../controller/InternalsController");


// Tentukan penyimpanan file dan direktori penyimpanan
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); // Direktori penyimpanan file
    },
    filename: function (req, file, cb) {
        // Penamaan file unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Master Data
router.get('/status', getMasterStatus);

// Leads Data
router.get('/leads', getLeads);
router.get('/leads/:salesId', getLeadsBySales);
router.post('/leads', createLeads);
router.put('/leads/assignee', putUpdateLeadsAssignee);
router.put('/leads/status/:leadsId', updateLeadsStatus);

router.post('/leads/followUp', postFollowUp);
router.put('/leads/follow-up', putUpdateFollowUp);

router.post('/survey', createSurveyRequest);
router.put('/survey/status', putApproveDisapproveRequest)
router.put('/survey/complete', upload.single('image'), putCompleteSurveyRequest)


router.get('/internals', getMasterInternals);

router.put('/sales/suspend', putSuspendSales);

module.exports = router;
