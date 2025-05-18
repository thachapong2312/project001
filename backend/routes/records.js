const express = require('express')
const { record_time, weight_update } = require('../controller/record')
const router = express.Router()

router.put('/timestamp', record_time)
router.put('/weightUpdate', weight_update)

module.exports = router