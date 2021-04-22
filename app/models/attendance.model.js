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
  timestamp: { type: String, required: true },
  /*
startTime:String,
endTime:String,
subjectCode:cs100
*/
  period: {
    type: any,
    required: true,
  },
  attendanceList: { type: any, required: true },
});

module.exports = mongoose.model("Attendance", attendanceScheme);
