const { Router } = require('express')
const router = Router()
const { showLoginPage, showRegisterPage , autherizeUser} = require('../controllers/AuthControls');




router.get('/login', showLoginPage);

router.get('/signup',showRegisterPage)

router.post("/logindata", autherizeUser)

module.exports = router