const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  time: {
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

module.exports = mongoose.model("GatePass", gatePassSchema);
