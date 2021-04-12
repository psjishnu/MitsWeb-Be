const express = require("express");
const router = express.Router();
const Subject = require("../models/subject.model");

/* 
----------------------------Subject Api's---------------------------------
*/

//return subjects list
router.get("/subject", async (req, res) => {
  try {
    const subjects = await Subject.find();

    if (subjects && subjects.length > 0) {
      return res.json({ success: true, data: subjects });
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
      return res.json({ success: true, data: subjects });
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

module.exports = router;
