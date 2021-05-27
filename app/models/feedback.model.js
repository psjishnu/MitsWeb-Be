const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const feedbackSchema = new mongoose.Schema({
  questionSet: {
    type: ObjectId,
    ref: "FeedbackQuestions",
    required: true,
  },

  user: {
    type: String,
    ref: "User",
    required: true,
  },

  faculty: {
    type: String,
    ref: "Faculty",
    required: true,
  },
  code: {
    type: String,
    ref: "Subject",
    required: true,
  },

  feedback: [
    {
      question: {
        type: ObjectId,
        ref: "FeedbackQuestions",
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Feedback", feedbackSchema);
