const express = require('express');
const router = express.Router();
const { newTextAnalysis, newProgramAnalysis, getSingleProgramAnalysis, getProgramAnalysis, getAllSentiments } = require('../controllers/analysisController');

router.post('/text-sentiment', newTextAnalysis);
router.post('/program-sentiment', newProgramAnalysis);
router.get('/getSingleProgramAnalysis/:id', getSingleProgramAnalysis);
router.get('/getRecent', getProgramAnalysis)
router.get('/tprogramSentiments', getAllSentiments);

module.exports = router;