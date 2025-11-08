const { Router } = require('express')
const showAdminDashboard = require('../controllers/AdminControls')
const protect = require('../middleware/protect')
const router = Router()


router.get('/adminDashboard', protect , showAdminDashboard)

module.exports = router