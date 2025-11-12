const { Router } = require('express')
const router = Router()
const { showLoginPage, showRegisterPage , autherizeUser, registerUser} = require('../controllers/AuthControls');




router.get('/login', showLoginPage);

router.get('/signup',showRegisterPage)

router.post("/logindata", autherizeUser)

router.post("/registerData", registerUser)

module.exports = router