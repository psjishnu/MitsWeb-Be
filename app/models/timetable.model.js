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
  timetable: [
    {
      day: String,
      periods: [
        {
          periodTime: {
            start: String,
            end: String,
          },
          subject: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Timetable", timetableSchema);
