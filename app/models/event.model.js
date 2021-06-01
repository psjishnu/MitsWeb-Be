const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  start: {
    type: String,
    required: true,
  },

  end: {
    type: String,
    required: true,
  },

  allDay: {
    type: Boolean,
    required: false,
  },

  uploadBy: {
    type: String,
    ref: "User",
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
