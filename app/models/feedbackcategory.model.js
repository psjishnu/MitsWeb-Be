const mongoose = require("mongoose");

const feedbackCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FeedbackCategory", feedbackCategorySchema);
