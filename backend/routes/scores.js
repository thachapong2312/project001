const  express = require('express')
const { addOrUpdatePISummary, recallingPISummary, pi_score_fetch, pi_survey_fetch } = require('../controller/score')
const router = express.Router()

router.post('/fillPiSum/:prof_id/:year/:course_name', addOrUpdatePISummary)
router.get('/callPiSum/:prof_id/:year/:course_name', recallingPISummary)
router.get('/piScoreFetching/:year/:course_name', pi_score_fetch)
router.get('/piSurveyFetching/:PiNumber/:year', pi_survey_fetch)

module.exports = router