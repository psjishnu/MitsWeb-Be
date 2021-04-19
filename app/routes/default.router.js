const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty.model");
const Student = require("../models/student.model");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/roll", async (req, res) => {
  const student = await Student.find({ department: "CSE" });
  for (var i = 0; i < student.length; i++) {
    const y = student[i].passoutYear - 4;
    console.log(student[i]);
  }
  res.json({});
});

module.exports = router;
