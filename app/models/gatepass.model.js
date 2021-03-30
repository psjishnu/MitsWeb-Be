const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const gatePassSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  onDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  onTime: {
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
});

module.exports = mongoose.model("GatePass", gatePassSchema);
