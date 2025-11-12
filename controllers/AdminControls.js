const path = require('path');
const User = require("../models/UsersSchema");
const Department = require("../models/department");


const showAdminDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/adminDashboard.html"));
}

const userCount = async (req, res) => {
    let result = await User.aggregate([
        {
            $group: {
                _id: "$role",
                total: { $sum: 1 }
            }
        }
    ])
    let sec = await Department.aggregate([
        { $count: "totalDepartments" }
    ])
    console.log(sec);
    result.push(sec[0]);
    console.log(result);
    
    res.send(result);

}
module.exports = {
    showAdminDashboard,
    userCount
}