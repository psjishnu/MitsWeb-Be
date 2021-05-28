const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const courseMaterialSchema = new mongoose.Schema({
  subject: {
    type: ObjectId,
    ref: "Subject",
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  resources: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],

  uploadBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseMaterial", courseMaterialSchema);
