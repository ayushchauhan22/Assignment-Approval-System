const path = require('path');
const Assignment = require("../models/assignment");
const mongoose = require('mongoose')
const { assignmentCountAggregate,
        getFiveAssignmentsAggregate,
 } = require('../aggregateFunction');
const { get } = require('http');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const assignmentCount = async (req, res) => {

    let result = await assignmentCountAggregate(req.user.userId);
    res.send(result);

}
const firstFiveAssignments = async (req, res) => {
    let result = await getFiveAssignmentsAggregate(req.user.userId);
    res.send(result);
}

const uploadAssignment = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const file = req.files?.file;

        // Validation
        if (!title || !file) {
            return res.status(400).json({ success: false, message: "Title and file are required" });
        }

        if (!category || !["Assignment", "Thesis", "Report"].includes(category)) {
            return res.status(400).json({ success: false, message: "Valid category is required" });
        }

        // Check file type - PDF or ZIP allowed
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.pdf') && !fileName.endsWith('.zip')) {
            return res.status(400).json({ success: false, message: "Only PDF and ZIP files are allowed" });
        }

        // Check file size - max 10MB
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            return res.status(400).json({ success: false, message: "File size must not exceed 10MB" });
        }

        // Upload to Cloudinary
        // Build folder path: <category>/<userId>/<titleSlug>-<timestamp>
        const categoryFolder = category.toLowerCase(); // 'assignment' | 'thesis' | 'report'
        const titleSlug = title.replace(/\s+/g, '-').replace(/[^a-z0-9\-]/gi, '').toLowerCase();
        const timestamp = Date.now();
        const folderPath = `${categoryFolder}/${req.user.userId}/${titleSlug}-${timestamp}`;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            folder: folderPath,
            public_id: `${titleSlug}`
        });

        // Save to database
        const newAssignment = new Assignment({
            userId: req.user.userId,
            title,
            description: description || '',
            category,
            fileUrl: result.secure_url,
            fileName: file.name,
            cloudinaryFolder: folderPath,
            cloudinaryPublicId: result.public_id,
            status: 'draft'
        });

        await newAssignment.save();

        res.status(201).json({
            success: true,
            message: "Assignment uploaded successfully",
            assignmentId: newAssignment._id,
            fileUrl: result.secure_url
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Error uploading assignment", error: error.message });
    }
}

const bulkUploadAssignments = async (req, res) => {
    try {
        const { titles, descriptions, category } = req.body;
        const files = req.files?.files;

        // Validation
        if (!category || !["Assignment", "Thesis", "Report"].includes(category)) {
            return res.status(400).json({ success: false, message: "Valid category is required" });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: "No files provided" });
        }

        // Ensure files is an array (single file returns object, multiple returns array)
        const fileArray = Array.isArray(files) ? files : [files];

        if (fileArray.length > 5) {
            return res.status(400).json({ success: false, message: "Maximum 5 files allowed" });
        }

        const results = [];

        // Process each file
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const title = titles[i] || `Assignment ${i + 1}`;
            const description = descriptions[i] || '';

            try {
                // Validate file type
                const fileName = file.name.toLowerCase();
                if (!fileName.endsWith('.pdf') && !fileName.endsWith('.zip')) {
                    results.push({
                        fileName: file.name,
                        success: false,
                        error: "Only PDF and ZIP files are allowed"
                    });
                    continue;
                }

                // Validate file size - max 10MB
                const maxSize = 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    results.push({
                        fileName: file.name,
                        success: false,
                        error: "File size must not exceed 10MB"
                    });
                    continue;
                }

                // Build Cloudinary folder path
                const categoryFolder = category.toLowerCase();
                const titleSlug = title.replace(/\s+/g, '-').replace(/[^a-z0-9\-]/gi, '').toLowerCase();
                const timestamp = Date.now();
                const folderPath = `${categoryFolder}/${req.user.userId}/${titleSlug}-${timestamp}`;

                // Upload to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                    resource_type: 'auto',
                    folder: folderPath,
                    public_id: `${titleSlug}`
                });

                // Save to database
                const newAssignment = new Assignment({
                    userId: req.user.userId,
                    title,
                    description,
                    category,
                    fileUrl: uploadResult.secure_url,
                    fileName: file.name,
                    cloudinaryFolder: folderPath,
                    cloudinaryPublicId: uploadResult.public_id,
                    status: 'draft'
                });

                await newAssignment.save();

                results.push({
                    fileName: file.name,
                    success: true,
                    assignmentId: newAssignment._id,
                    title: title,
                    fileUrl: uploadResult.secure_url
                });

            } catch (fileError) {
                console.error(`Error uploading ${file.name}:`, fileError);
                results.push({
                    fileName: file.name,
                    success: false,
                    error: fileError.message || "Upload failed"
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Bulk upload completed`,
            results: results
        });

    } catch (error) {
        console.error("Bulk upload error:", error);
        res.status(500).json({ success: false, message: "Error with bulk upload", error: error.message });
    }
}

const showbulkUploadAssignmentsPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/bulkUploadAssignments.html"));
}

const showAssignmentListPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/assignmentList.html"));
}

// API: Get all assignments for authenticated user, with optional status filter and sort
const getAssignmentsForUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, sort } = req.query; // status optional, sort = 'asc'|'desc'
        const filter = { userId };
        if (status && status !== 'All') {
            // support both exact and normalized matching
            filter.status = status.toLowerCase();
        }

        let query = Assignment.find(filter).select('title category status createdAt reviewerId');

        if (sort === 'asc') query = query.sort({ createdAt: 1 });
        else query = query.sort({ createdAt: -1 });

        const assignments = await query.exec();

        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments list:', error);
        res.status(500).json({ success: false, message: 'Error fetching assignments' });
    }
}

// API: Get single assignment by id (must belong to authenticated user)
const getAssignmentById = async (req, res) => {
    try {
        // Debug logging to help trace malformed ids
        const userId = req.user && req.user.userId;
        let assignmentId = String(req.params.id || '').trim();
        console.log('getAssignmentById called - id:', assignmentId, 'userId:', userId);

        if (!assignmentId) {
            return res.status(400).json({ success: false, message: 'Invalid assignment id' });
        }

        // Attempt to find assignment by id
        let assignment;
        try {
            assignment = await Assignment.findById(assignmentId).exec();
        } catch (castErr) {
            // Mongoose cast error (invalid ObjectId)
            console.warn('Invalid assignment id received:', assignmentId);
            return res.status(400).json({ success: false, message: 'Invalid assignment id' });
        }

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // If assignment exists but belongs to another user, return 403 so caller knows it's a permissions issue
        if (String(assignment.userId) !== String(userId)) {
            console.warn('User attempted to access assignment belonging to another user:', { requestedId: assignmentId, userId });
            return res.status(403).json({ success: false, message: 'You are not authorized to view this assignment' });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment by id:', error);
        res.status(500).json({ success: false, message: 'Error fetching assignment' });
    }
}

const showAssignmentDetailsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/assignmentDetails.html'));
}

module.exports = {
    assignmentCount,
    firstFiveAssignments,
    uploadAssignment,
    bulkUploadAssignments,
    showbulkUploadAssignmentsPage,
    showAssignmentListPage,
    getAssignmentById,
    getAssignmentsForUser,
    showAssignmentDetailsPage
}