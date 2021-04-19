const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: false,
    default: "CSE",
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
  currentYear: {
    type: Number,
    required: false,
  },
  passoutYear: {
    type: Number,
    required: false,
  },
  studentId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
