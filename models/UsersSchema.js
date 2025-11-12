const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  deptId: [Number]
});

module.exports = mongoose.model("users", userSchema);


