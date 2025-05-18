const  express = require('express')
const { name, score, subjectss, piie, allData } = require('../controller/test')
const router = express.Router()

router.get('/findname/:Id', name)
router.get('/findscore/:Id', score)
router.get('/findsubject/:Id', subjectss)
router.get('/findpi/:Id', piie)
router.get('/finddata/:Id', allData)

module.exports = router