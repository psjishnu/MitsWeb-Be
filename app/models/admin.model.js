const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
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
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  registered: {
    type: Boolean,
    required: false,
    default: false,
  },
  photo: {
    type: String,
    default: "https://www.poutstation.com/upload/photos/avatar.jpg",
  },
});

module.exports = mongoose.model("Admin", adminSchema);
