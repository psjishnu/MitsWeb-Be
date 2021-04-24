const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const examSchema = new mongoose.Schema({
  examType: {
    type: ObjectId,
    ref: "ExamType",
    required: true,
  },

  subject: {
    type: ObjectId,
    ref: "Subject",
    required: true,
  },

  startTimestamp: {
    type: String,
    required: true,
  },

  endTimestamp: {
    type: string,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  numberOfQuestions: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Marks", marksSchema);
