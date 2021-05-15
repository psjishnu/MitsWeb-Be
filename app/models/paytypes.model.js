const mongoose = require("mongoose");
const payTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  dueDate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PayType", payTypeSchema);
