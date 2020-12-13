const mongoose = require("mongoose");
const { number } = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://www.poutstation.com/upload/photos/avatar.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
