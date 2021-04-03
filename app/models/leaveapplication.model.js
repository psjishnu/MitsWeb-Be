const mongoose = require("mongoose");

const leaveApplicationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  fromDate: {
    type: String,
    required: true,
  },
  requestBy: {
    type: String,
    ref: "User",
  },
  status: {
    type: Number,
    default: 0,
  },
  department: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("LeaveApplication", leaveApplicationSchema);
