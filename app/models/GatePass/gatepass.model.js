const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const gatePassSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  onDate: {
    type: Date,
    required: true,
  },
  onTime: {
    type: String,
    required: true,
  },
  requestBy: {
    type: ObjectId,
    ref: "User",
  },
});

mongoose.model("GatePass", gatePassSchema);
