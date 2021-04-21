const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },

  subjectCode: {
    type: String,
    required: true,
  },

  teacherId: {
    type: String,
    required: true,
  },

  examType: {
    type: String,
    required: true,
  },

  marks: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Marks", marksSchema);
