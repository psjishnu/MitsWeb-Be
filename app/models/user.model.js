const mongoose = require("mongoose");
const { number, any, boolean } = require("joi");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
