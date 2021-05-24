const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payment: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
