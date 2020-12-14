const mongoose = require("mongoose");
const { number, any } = require("joi");

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
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://www.poutstation.com/upload/photos/avatar.jpg",
  },
  address: {
    type: String,
    require: false,
  },
  parentDetails: {
    type: Object,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  bloodGroup: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
