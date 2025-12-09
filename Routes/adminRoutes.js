const { Router } = require('express')
const {protect} = require('../middleware/protect')

const {
    showAdminDashboard, 
    userCount,
    showCreateUserForm,
    getUsersData,
    showUsersListPage,
    showEditPage,
    getUserByEmail,
    updateUser,
    deleteUserByemailId,
} = require('../controllers/AdminControls')


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
router.get('/users_list', protect, getUsersData)
router.get('/all_UsersPage', protect, showUsersListPage )
router.get('/users/edit_user', protect, showEditPage)
router.get('/users/:email/edit', protect, getUserByEmail)
router.put('/users/:email/update', protect, updateUser);
router.get('/users/:email/delete', protect, deleteUserByemailId )


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