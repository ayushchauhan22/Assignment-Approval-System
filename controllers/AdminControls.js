const path = require('path');
const User = require("../models/UsersSchema");
const Department = require("../models/department");
const {
    hashPasswordSync,
    verifyPasswordSync
} = require('../hashPassword')
const { userCountAggregate, getUsersDataAggregate } = require('../aggregateFunction');

const showAdminDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/adminDashboard.html"));
}

const userCount = async (req, res) => {
    let result = await userCountAggregate();
    res.send(result);

}

const getUsersData = async (req, res) => {
    const { page = 1, name = "", role = "", department = "" } = req.query;

    const matchStage = {};

    if (name) {
        matchStage.$or = [
            { name: { $regex: name, $options: "i" } },
            { email: { $regex: name, $options: "i" } }
        ];
    }

    if (department && department !== "All") {
        matchStage.deptId = Number(department);  // convert if needed
    }

    // Role filter
    if (role && role !== "All") {
        matchStage.role = role;
    }

    // Never show admin users
    matchStage.role = matchStage.role
        ? matchStage.role
        : { $ne: "admin" };

    if (matchStage.role !== role) {
        matchStage.role = { $ne: "admin" };
    }

    const data = await getUsersDataAggregate(matchStage, page);

    let hasnext = data.length === 21;

    res.send({
        data,
        hasnext
    });
};

const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const emailID = req.params.email;
    const { name, email, password, deptId } = req.body;

    const hashedPassword = hashPasswordSync(password);

    const updatedUser = await User.findOneAndUpdate(
        { email: emailID }, 
        { 
            name, 
            email, 
            password: hashedPassword,  
            deptId 
        },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
    });
};


const deleteUserByemailId = async (req, res) => {
    const email = (req.params.email);

    const del = await User.findOneAndDelete({ email: email })

    if (!del) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User updated successfully",
        user: del
    });
}



const showCreateUserForm = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/createUser.html"));
}

const showUsersListPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/usersList.html"));
}

const showEditPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/editUser.html"));
}
module.exports = {
    showAdminDashboard,
    userCount,
    showCreateUserForm,
    getUsersData,
    showUsersListPage,
    showEditPage,
    getUserByEmail,
    updateUser,
    deleteUserByemailId,
    

}