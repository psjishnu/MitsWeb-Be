const mongoose = require("mongoose");
const examTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  maxMark: {
    type: Number,
    required: true,
  },

  passMark: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ExamType", examTypeSchema);
