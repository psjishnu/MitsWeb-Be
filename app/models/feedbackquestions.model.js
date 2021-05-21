const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const feedbackQuestionsSchema = new mongoose.Schema({
  category: {
    type: ObjectId,
    ref: "FeedbackCategory",
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("FeedbackQuestions", feedbackQuestionsSchema);
