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
      return res.status(200).json({ success: true, data: subjects });
    } else {
      return res
        .status(202)
        .json({ success: false, msg: "No subjects information found!!" });
    }
  } catch (err) {
    console.log(`Failed to edit subject with error:${err.message}`.red);
    return res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
