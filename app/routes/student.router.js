const express = require("express");
const router = express.Router();
const { studentAuth } = require("../functions/jwt");
const Timetable = require("../models/timetable.model");
const Student = require("../models/student.model");

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
module.exports = router;
