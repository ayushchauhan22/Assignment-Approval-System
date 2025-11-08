const path = require('path');
const jwt = require('jsonwebtoken');
const {hashPasswordSync, verifyPasswordSync} = require('../hashPassword')

const user = [
    {
        id: 101,
        name: "aman",
        role: "admin",
        password: "$2b$12$dE2l2/i.Vf9CVQjnzinrd.d/EL4lsvf9XHFA8XEPV2cCBPh5Av/9a", //1234
        email: "aman123@gmail.com"
    }
]
const showLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/loginPage.html"));
};

const showRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/registerPage.html"));
};

const autherizeUser = (req, res) => {
    try {
        let userFound = user.find(ele => ele.email == req.body.email);
        
        if (userFound) {
            if (verifyPasswordSync(req.body.password, userFound.password)) {
                const token = jwt.sign({ username: req.body.username, role: userFound.role }, process.env.JWT_KEY, { expiresIn: '5m' })
                res.cookie("jwt", token)
                
                if (userFound.role == "admin") {
                    res.redirect('/admin/adminDashboard');
                }

            } else {
                res.redirect('/auth/login/?error=incorrect_password');
            }
        } else {
            res.redirect('/auth/login/?error=invalid_credentials');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}


module.exports = {
    showLoginPage,
    showRegisterPage,
    autherizeUser
};
