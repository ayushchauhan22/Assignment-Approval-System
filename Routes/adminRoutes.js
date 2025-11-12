const { Router } = require('express')
const {showAdminDashboard, userCount} = require('../controllers/AdminControls')
const protect = require('../middleware/protect')
const {
    getDepartments,
    showDepartments,
    createDepartment,
    getDepartmentByID,
    updateDepartment,
    viewAllDepartments,
    editDepartmentPage
} = require('../controllers/DepartmentControls');
const router = Router()


router.get('/adminDashboard', protect , showAdminDashboard)
router.get('/getUserCount', protect, userCount)

router.get('/departments/edit_department', protect, editDepartmentPage)
router.get('/department/getdata', protect, getDepartments);
router.get('/department/create', protect, showDepartments);
router.get("/departments", protect, viewAllDepartments);
router.post('/departments', protect, createDepartment);
router.get('/departments/:deptId/edit', protect, getDepartmentByID);
router.put('/department/:deptId/update', protect, updateDepartment);

module.exports = router