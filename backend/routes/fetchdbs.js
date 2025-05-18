const  express = require('express')
const { test, tests_subjs, resp_committee, year_list_outcome, courses_list_outcome, weight_outcome, fetchSurveyScore, student_outcome } = require('../controller/fetchdb')
const router = express.Router()

router.get('/test/:Id/:Date', test)
router.get('/tests/subjects/:subjName', tests_subjs)
router.get('/committee/setup/:Date/:ProfId', resp_committee)
router.get('/getSingleyear', year_list_outcome)
router.get('/courses_list/:ProfId', courses_list_outcome)
router.get('/weight/:AcdYear/:ProfId', weight_outcome)
router.get('/surveyScorebyYear/:SurveyYear/:PI_id', fetchSurveyScore) // incomplete pi_survey data
router.get('/studentOutcome/:RespYear/:ProfId', student_outcome)

module.exports = router