const { Router } = require('express')
const {
    showAdminDashboard, 
    userCount,
    showCreateUserForm
} = require('../controllers/AdminControls')
const protect = require('../middleware/protect')
const {
    getAllDepartmentsData,
    getDepartments,
    showDepartments,
    createDepartment,
    getDepartmentByID,
    updateDepartment,
    viewAllDepartments,
    editDepartmentPage,
    deleteDepartmentById
} = require('../controllers/DepartmentControls');
const router = Router()


router.get('/adminDashboard', protect , showAdminDashboard)
router.get('/getUserCount', protect, userCount)
router.get('/users/create_route', protect, showCreateUserForm)

router.get('/departments/seeAllData', protect, getAllDepartmentsData)
router.get('/departments/edit_department', protect, editDepartmentPage)
router.get('/department/getdata', protect, getDepartments);
router.get('/department/create', protect, showDepartments);
router.get("/departments", protect, viewAllDepartments);
router.post('/departments', protect, createDepartment);
router.get('/departments/:deptId/edit', protect, getDepartmentByID);
router.put('/department/:deptId/update', protect, updateDepartment);
router.get('/departments/:deptId/delete', protect, deleteDepartmentById )
module.exports = router