const mongoose = require("mongoose");

const attendanceScheme = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  timeStamp: { type: String, required: true },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  attendanceList: { type: Object, required: true },
});

module.exports = mongoose.model("Attendance", attendanceScheme);
