const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  feedback: {
    type: Boolean,
    default: false,
    required: false,
  },
  payment: {
    type: Boolean,
    default: false,
    required: false,
  },
});

module.exports = mongoose.model("Stats", statsSchema);
