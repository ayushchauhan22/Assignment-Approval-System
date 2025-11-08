const path = require('path');


const showAdminDashboard = (req,res)=>{
    res.sendFile(path.join(__dirname, "../pages/adminDashboard.html"));
}

module.exports = showAdminDashboard