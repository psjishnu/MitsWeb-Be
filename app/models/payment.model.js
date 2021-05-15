const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const paymentSchema = new mongoose.Schema({
  // user: {
  //   type: ObjectId,
  //   ref: "User",
  //   required: true,
  // },

  payment: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
