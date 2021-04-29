const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const marksSchema = new mongoose.Schema({
  exam: {
    type: ObjectId,
    ref: "Exam",
    required: true,
  },

  markList: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Marks", marksSchema);
