const path = require('path');
// const User = require("../models/UsersSchema");
// const Department = require("../models/department");

const showUserDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/userDashboard.html"));
}


module.exports = {
    showUserDashboard,
}