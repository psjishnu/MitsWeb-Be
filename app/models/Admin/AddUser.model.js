const mongoose = require("mongoose");
const { number, any, boolean } = require("joi");

const AddUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AuthorizedUser", AddUserSchema);
