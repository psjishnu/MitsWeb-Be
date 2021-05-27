const express = require("express");
const router = express.Router();
const { studentAuth } = require("../functions/jwt");
const Timetable = require("../models/timetable.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");

router.get("/timetable", studentAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.json({ msg: "Error", success: false });
    }
    const { department, currentYear } = student;
    const semester = Number(currentYear) * 2;
    let timetable = await Timetable.findOne({
      $or: [{ semester }, { semester: semester - 1 }],
      department,
    }).select("periodTimings");
    if (!timetable) {
      return res.json({ success: false, msg: "Timetable not found" });
    }
    return res.json({
      success: true,
      data: timetable.periodTimings || [],
    });
  } catch (err) {
    console.log(
      `Failed to return timetable list with error:${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/teachers", studentAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.json({ success: false, msg: "Student not found" });
    }
    const { currentYear, department } = student;
    const subjects = await Subject.find({
      department,
      $or: [
        { semester: Number(currentYear) * 2 },
        { semester: Number(currentYear) * 2 - 1 },
      ],
    }).select("name code taughtBy.name taughtBy.email");
    if (!subjects) {
      return res.json({ success: false, msg: "No subjects found" });
    }

    return res.json({ success: true, data: subjects });
  } catch (err) {
    console.log(`Failed to return teachers list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});
module.exports = router;
