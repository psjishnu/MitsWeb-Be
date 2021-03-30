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
  onTime: {
    type: String,
    required: true,
  },
  requestBy: {
    type: String,
    ref: "User",
  },
  department: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("GatePass", gatePassSchema);
