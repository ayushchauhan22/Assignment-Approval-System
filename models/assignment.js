const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ["Assignment", "Thesis", "Report"], default: "Assignment" },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  // Cloudinary metadata to ease management (folder path and public id)
  cloudinaryFolder: { type: String },
  cloudinaryPublicId: { type: String },
  status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "draft" },
}, { timestamps: true });

module.exports = mongoose.model("assignment", assignmentSchema, "assignment");
