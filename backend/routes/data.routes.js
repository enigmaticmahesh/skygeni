const express = require('express')
const router = express.Router()

const dataController = require('../controller/data.controller')

router.get('/team', dataController.getTeamData)
router.get('/acc-ind', dataController.getAccIndData)

module.exports = router