const path = require('path');
const jwt = require('jsonwebtoken');
const { hashPasswordSync, verifyPasswordSync } = require('../hashPassword')
const User = require("../models/UsersSchema");

const showLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/loginPage.html"));
};

const showRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/Register.html"));
};

const autherizeUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });

        if (userFound) {
            if (verifyPasswordSync(password, userFound.password)) {
                const token = jwt.sign({ username: userFound.name, role: userFound.role }, process.env.JWT_KEY, { expiresIn: '5h' })
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

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, deptId } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect(req.get('referer') + '?error=User_Already_Exist');
        }

        const hashedPassword = hashPasswordSync(password);

        let data = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "student",
        }
        if (deptId) {
            data.deptId = deptId;
        }

        await User.create(data);
        // const token = jwt.sign({ username: req.body.username, role: "student" }, process.env.JWT_KEY, { expiresIn: '5h' })

        // res.cookie("jwt", token)
        res.redirect(req.get('referer') + '?success=User_Added_successfully');
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

module.exports = {
    showLoginPage,
    showRegisterPage,
    autherizeUser,
    registerUser
};
