const { Router } = require('express')
const router = Router()
const {
    showLoginPage,
    showRegisterPage,
    autherizeUser,
    registerUser,
    logout
} = require('../controllers/AuthControls');




router.get('/login', showLoginPage);

router.get('/signup', showRegisterPage)

router.post("/logindata", autherizeUser)

router.post("/registerData", registerUser)

router.get("/logout", logout)

module.exports = router