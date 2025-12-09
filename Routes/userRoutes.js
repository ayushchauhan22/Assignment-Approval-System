const { Router } = require('express')
const path = require('path')
const {
    protect,
    authProtect
} = require('../middleware/protect')

const {
    showUserDashboard,
} = require('../controllers/UserControls')

const {
    assignmentCount,
    firstFiveAssignments,
    uploadAssignment,
    bulkUploadAssignments,
    showbulkUploadAssignmentsPage,
    showAssignmentListPage,
    getAssignmentById,
    getAssignmentsForUser,
    showAssignmentDetailsPage
} = require('../controllers/AssignmentControls')

const router = Router()


router.get('/userDashboard', authProtect(["student"]), showUserDashboard)
router.get('/bulkUploadAssignments', authProtect(["student"]), (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/bulkUploadAssignments.html'))
})

router.get('/assignment/assignment_details',  authProtect(["student"]), assignmentCount)
router.get('/assignment/recent', authProtect(["student"]), firstFiveAssignments)
router.get('/assignment/list', authProtect(["student"]), getAssignmentsForUser)
// register more specific routes before the param route to avoid accidental matches
router.get('/assignment/bulkUploadAssignments', authProtect(["student"]), showbulkUploadAssignmentsPage)
router.get('/assignment/details', authProtect(["student"]), showAssignmentDetailsPage)
router.get('/assignment/:id', authProtect(["student"]), getAssignmentById)
router.post('/assignment/upload', authProtect(["student"]), uploadAssignment)
router.post('/assignment/bulk-upload', authProtect(["student"]), bulkUploadAssignments)
router.get('/assignmentList', authProtect(["student"]), showAssignmentListPage)
module.exports = router