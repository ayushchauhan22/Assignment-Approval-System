const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  deptId: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  programType: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model("departments", departmentSchema);
