const express = require('express')
const router = express.Router();

const { getAllSentiments, getRecentSentiments } = require('../controllers/sentimentsController');


router.get('/sentiments', getAllSentiments);
router.get('/recentSentiments', getRecentSentiments);


module.exports = router;