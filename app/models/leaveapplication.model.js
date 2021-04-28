const mongoose = require("mongoose");

const leaveApplicationSchema = new mongoose.Schema({
  description: {
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
  fromDate: {
    type: String,
    required: false,
  },
  toDate: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  fromTime: {
    type: String,
    required: false,
  },
  toTime: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("LeaveApplication", leaveApplicationSchema);
