const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected....");
  } catch (err) {
    console.log("MongoDB connection error ", err);
  }
}

module.exports = connectDB;