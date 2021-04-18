const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  periodTimings: [
    {
      day: String,
      timings: [
        {
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Timetable", timetableSchema);
