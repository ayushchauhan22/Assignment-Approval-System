const path = require('path');
const jwt = require('jsonwebtoken');
const { hashPasswordSync, verifyPasswordSync } = require('../hashPassword')
const User = require("../models/UsersSchema");
const { sendOTPEmail } = require("../emailService")

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
                const token = jwt.sign({ userId: userFound._id, role: userFound.role }, process.env.JWT_KEY, { expiresIn: '5h' })
                res.cookie("jwt", token)

                return res.json({
                    success: true,
                    role: userFound.role,
                    message: "Login successful"
                });

            } else {
                return res.json({ success: true, message: "incorrect_password" });
            }
        } else {
            return res.json({ success: true, message: "invalid_credentials" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, deptId, phone } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exist" });
        }

        const hashedPassword = hashPasswordSync(password);

        let data = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "student",
            phone: phone,
            deptId : deptId
        }
        // if (deptId) {
        //     data.;
        // }

        await User.create(data);
        await sendOTPEmail(email, name, password);
        // const token = jwt.sign({ username: req.body.username, role: "student" }, process.env.JWT_KEY, { expiresIn: '5h' })

        // res.cookie("jwt", token)
        return res.json({ success: true, message: "User created and email sent" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

const logout = (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, secure: false });
    return res.json({ success: true, message: "Logged out successfully" });
}

module.exports = {
    showLoginPage,
    showRegisterPage,
    autherizeUser,
    registerUser,
    logout
};
