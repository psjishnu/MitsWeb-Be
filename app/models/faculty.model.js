const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
  },
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
  isHOD: {
    type: Boolean,
    required: false,
    default: false,
  },
  advisor: {
    type: Object,
    required: false,
    default: null,
  },
  department: {
    type: String,
    default: "CSE",
  },
  photo: {
    type: String,
    default: "https://www.poutstation.com/upload/photos/avatar.jpg",
  },
  address: {
    type: String,
    require: false,
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

module.exports = mongoose.model("Faculty", facultySchema);
