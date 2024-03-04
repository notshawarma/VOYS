const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const { newProgram, getPrograms, getSingleProgram, updateProgram, deleteProgram } = require('../controllers/programController');

router.post('/newProgram', upload.array('images', 10), newProgram);
router.get('/getPrograms', getPrograms);
router.route('/getPrograms/:id').put(upload.array('images', 10), updateProgram).delete(deleteProgram);
router.get('/getSingleProgram/:id', getSingleProgram);


module.exports = router;