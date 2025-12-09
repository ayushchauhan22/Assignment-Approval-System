const Department = require("./models/department");
const User = require("./models/UsersSchema");
const Assignment = require("./models/assignment");
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

const getDepartmentsAggregate = async (matchStage, page) => {
    return await Department.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users",
                localField: "deptId",
                foreignField: "deptId",
                as: "userData"
            }
        },
        {
            $project: {
                _id: 0,
                deptId: 1,
                name: 1,
                programType: 1,
                totalUsers: { $size: "$userData" }
            }
        },
        { $skip: (page - 1) * 10 },
        { $limit: 11 }
    ]);
};

const assignmentCountAggregate = async (userId) => {
    
    return await Assignment.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: "$status",
                total: { $sum: 1 }
            }
        }
    ]);
};

const userCountAggregate = async () => {
    let result = await User.aggregate([
        {
            $group: {
                _id: "$role",
                total: { $sum: 1 }
            }
        }
    ]);
    let sec = await Department.aggregate([
        { $count: "totalDepartments" }
    ]);
    result.push(sec[0]);
    return result;
};

const getUsersDataAggregate = async (matchStage, page) => {
    return await User.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "departments",
                localField: "deptId",
                foreignField: "deptId",
                as: "userData"
            }
        },
        {
            $project: {
                _id: 0,
                deptId: 1,
                name: 1,
                email: 1,
                role: 1,
                department: { $arrayElemAt: ["$userData.name", 0] }
            }
        },
        { $skip: (page - 1) * 20 },
        { $limit: 21 }
    ]);
};

const getFiveAssignmentsAggregate = async (userId) => {
    return await Assignment.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
            $project: {
                _id: 0,
                title: 1,
                fileUrl: 1,
                status: 1,
                createdAt: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: 5
        }
    ]);
}

module.exports = {
    getDepartmentsAggregate,
    assignmentCountAggregate,
    userCountAggregate,
    getUsersDataAggregate,
    getFiveAssignmentsAggregate
};
