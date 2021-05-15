const express = require("express");
const router = express.Router();
const Subject = require("../models/subject.model");
const ExamType = require("../models/examtype.model");
const Timetable = require("../models/timetable.model");
const { isValidObjectId } = require("mongoose");

/* 
----------------------------Exam Api's---------------------------------
*/

//get exam types
router.get("/examtype", async (req, res) => {
  try {
    const exams = await ExamType.find({});
    return res.json({ success: true, data: exams.reverse() });
  } catch (err) {
    console.log(`Couldn't get exam type with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Subject Api's---------------------------------
*/

//return subjects list
router.get("/subject", async (req, res) => {
  try {
    const subjects = await Subject.find();

    if (subjects && subjects.length > 0) {
      return res.json({ success: true, data: subjects.reverse() });
    } else {
      return res.json({
        success: false,
        msg: "No subjects information found!!",
      });
    }
  } catch (err) {
    console.log(`Failed to return subjects list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//return department and semester wise subjects list
router.get("/subject/:department/:semester", async (req, res) => {
  try {
    const department = req.params.department;
    const semester = req.params.semester;
    const subjects = await Subject.find({
      department,
      semester,
    });

    if (subjects && subjects.length > 0) {
      return res.json({ success: true, data: subjects.reverse() });
    } else {
      return res.json({
        success: false,
        msg: "No subjects information found!!",
      });
    }
  } catch (err) {
    console.log(`Failed to return subjects list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/timetable/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid id..!" });
    }
    const timeTable = await Timetable.findOne({ _id });
    if (!timeTable) {
      return res.json({ success: false, msg: "Invalid id..!" });
    }
    return res.json({
      data: timeTable,
      success: true,
    });
  } catch (err) {
    console.log(`Failed to return timetable with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
