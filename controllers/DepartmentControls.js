const Department = require("../models/department");
const User = require("../models/UsersSchema");
const path = require('path');
const { getDepartmentsAggregate } = require('../aggregateFunction');

const showDepartments = async (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/createDepartment.html"));
};

const getAllDepartmentsData = async(req,res)=>{
    const depmnt = await Department.find()

    res.send(depmnt)
}

const getDepartments = async (req, res) => {
    const { page = 1, name = "", programType = "" } = req.query;

    const matchStage = {};

    if (name) {
        matchStage.name = { $regex: name, $options: "i" };
    }

    if (programType && programType !== "All") {
        matchStage.programType = programType;
    }

    const data = await getDepartmentsAggregate(matchStage, page);

    // pagination check
    const hasnext = data.length === 11;

    res.send({
        data,
        hasnext
    });
};


const viewAllDepartments = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/viewAllDepartments.html"));
}
const createDepartment = async (req, res) => {
    const { Department_name, program, address } = req.body;
    try {
        const lastDept = await Department.findOne().sort({ deptId: -1 });
        const newDeptId = lastDept ? lastDept.deptId + 1 : 1;

        const newDepartment = new Department({
            deptId: newDeptId,
            name: Department_name,
            programType: program,
            address: address
        });

        await newDepartment.save();
        res.send("ok")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const editDepartmentPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/editDepartments.html"))
}


const getDepartmentByID = async (req, res) => {
    const { deptId } = req.params;
    try {
        const dept = await Department.findOne({ deptId: Number(deptId) });
        res.json(dept);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    const deptId = Number(req.params.deptId);
    const { name, programType, address } = req.body;

    const updatedDept = await Department.findOneAndUpdate(
        { deptId: deptId },
        { name, programType, address },
        { new: true }
    );

    if (!updatedDept) {
        return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
        message: "Department updated successfully",
        department: updatedDept
    });
};


const deleteDepartmentById = async (req, res) => {
    const deptId = Number(req.params.deptId);

    const del = await Department.findOneAndDelete({ deptId: deptId })

    if (!del) {
        return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
        message: "Department updated successfully",
        department: del
    });
}

module.exports = {
    getAllDepartmentsData,
    getDepartments,
    showDepartments,
    createDepartment,
    getDepartmentByID,
    updateDepartment,
    viewAllDepartments,
    editDepartmentPage,
    deleteDepartmentById
};
