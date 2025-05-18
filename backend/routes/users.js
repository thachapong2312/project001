const express = require('express')
const { user } = require('../controller/user')
const router = express.Router()

router.put('/:prof_id', user)

module.exports = router